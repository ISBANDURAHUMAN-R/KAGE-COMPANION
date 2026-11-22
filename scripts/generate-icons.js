const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createKagePng(width, height) {
  const rgba = Buffer.alloc(width * height * 4);
  const cx = width / 2;
  const cy = height / 2;
  const r = width / 2 - 2;

  const scale = width / 32;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= r) {
        // Deep obsidian background
        rgba[idx] = 10;
        rgba[idx + 1] = 10;
        rgba[idx + 2] = 14;
        rgba[idx + 3] = 255;

        // Blood red ring border
        if (dist >= r - (2 * scale)) {
          rgba[idx] = 255;
          rgba[idx + 1] = 26;
          rgba[idx + 2] = 43;
          rgba[idx + 3] = 255;
        }

        // Left Eye
        const isLeftEye = (x >= cx - 7 * scale && x <= cx - 2.5 * scale && y >= cy - 3 * scale && y <= cy + 3 * scale);
        // Right Eye
        const isRightEye = (x >= cx + 2.5 * scale && x <= cx + 7 * scale && y >= cy - 3 * scale && y <= cy + 3 * scale);
        // Horns
        const isHornLeft = (x >= cx - 6.5 * scale && x <= cx - 3.5 * scale && y >= cy - 9 * scale && y <= cy - 4 * scale);
        const isHornRight = (x >= cx + 3.5 * scale && x <= cx + 6.5 * scale && y >= cy - 9 * scale && y <= cy - 4 * scale);

        if (isLeftEye || isRightEye) {
          rgba[idx] = 255;
          rgba[idx + 1] = 26;
          rgba[idx + 2] = 43;
          rgba[idx + 3] = 255;
        } else if (isHornLeft || isHornRight) {
          rgba[idx] = 220;
          rgba[idx + 1] = 15;
          rgba[idx + 2] = 30;
          rgba[idx + 3] = 255;
        } else if (dist < r - (2 * scale) && (y >= cy + 5 * scale && y <= cy + 7 * scale && Math.abs(dx) <= 3 * scale)) {
          rgba[idx] = 255;
          rgba[idx + 1] = 255;
          rgba[idx + 2] = 255;
          rgba[idx + 3] = 220;
        }
      } else {
        rgba[idx] = 0;
        rgba[idx + 1] = 0;
        rgba[idx + 2] = 0;
        rgba[idx + 3] = 0;
      }
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(6, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    scanlines[rowStart] = 0;
    rgba.copy(scanlines, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(scanlines);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.slice(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Multi-resolution ICO builder
function createMultiIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Count

  let offset = 6 + (16 * count);
  const dirEntries = [];
  const payloads = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    // 0 means 256 in ICO format
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // Bit depth
    entry.writeUInt32LE(img.buffer.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset

    dirEntries.push(entry);
    payloads.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...payloads]);
}

const iconsDir = path.join(__dirname, '../src/renderer/assets/icons');
fs.mkdirSync(iconsDir, { recursive: true });

const png32 = createKagePng(32, 32);
const png64 = createKagePng(64, 64);
const png256 = createKagePng(256, 256);

fs.writeFileSync(path.join(iconsDir, 'tray-icon.png'), png32);
fs.writeFileSync(path.join(iconsDir, 'icon-64.png'), png64);
fs.writeFileSync(path.join(iconsDir, 'icon.png'), png256);

const multiIco = createMultiIco([
  { width: 256, height: 256, buffer: png256 },
  { width: 64, height: 64, buffer: png64 },
  { width: 32, height: 32, buffer: png32 }
]);

fs.writeFileSync(path.join(iconsDir, 'icon.ico'), multiIco);

console.log('Successfully generated multi-resolution KAGE COMPANION icon.ico (256x256, 64x64, 32x32)');

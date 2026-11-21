const assert = require('assert');
const fs = require('fs');
const path = require('path');
const db = require('../src/main/database/db');
const personalityEngine = require('../src/main/engine/personalityEngine');
const relationshipEngine = require('../src/main/engine/relationshipEngine');
const { KAGE_DIALOGUES, KAGE_CHAN_DIALOGUES, CROSS_DIALOGUES } = require('../src/main/engine/dialogueDatabase');

async function runTests() {
  console.log('=== RUNNING KAGE COMPANION AUTOMATED SYSTEM TESTS ===');

  const testDataDir = path.join(__dirname, 'temp-test-data');
  if (fs.existsSync(testDataDir)) {
    fs.rmSync(testDataDir, { recursive: true, force: true });
  }

  // 1. Database Init Test
  console.log('[Test 1] Testing SQLite Database Initialization...');
  await db.init(testDataDir);
  assert(db.initialized === true, 'Database should be initialized');
  console.log('  -> DB init PASS');

  // 2. Settings Test
  console.log('[Test 2] Testing Default & Custom Settings...');
  assert.strictEqual(db.getSetting('desktop_mode'), 'normal', 'Default desktop_mode should be normal');
  db.setSetting('desktop_mode', 'active');
  assert.strictEqual(db.getSetting('desktop_mode'), 'active', 'desktop_mode should be updated to active');
  console.log('  -> Settings CRUD PASS');

  // 3. Characters Test
  console.log('[Test 3] Testing Characters Schema & CRUD...');
  const kage = db.getCharacter('kage');
  const chan = db.getCharacter('kage-chan');
  assert(kage !== null, 'KAGE must exist in DB');
  assert(chan !== null, 'KAGE-CHAN must exist in DB');
  assert.strictEqual(kage.enabled, 1, 'KAGE enabled should default to 1');
  assert.strictEqual(chan.enabled, 1, 'KAGE-CHAN enabled should default to 1');

  db.updateCharacter('kage', { mood: 'happy', affection: 85, scale: 1.2 });
  const updatedKage = db.getCharacter('kage');
  assert.strictEqual(updatedKage.mood, 'happy', 'KAGE mood should update');
  assert.strictEqual(updatedKage.affection, 85, 'KAGE affection should update');
  assert.strictEqual(updatedKage.scale, 1.2, 'KAGE scale should update');
  console.log('  -> Characters CRUD PASS');

  // 4. Dialogue Database Integrity Test
  console.log('[Test 4] Testing Dialogue Database Completeness...');
  assert(KAGE_DIALOGUES.idle.length > 0, 'KAGE must have idle dialogues');
  assert(KAGE_CHAN_DIALOGUES.idle.length > 0, 'KAGE-CHAN must have idle dialogues');
  assert(CROSS_DIALOGUES.length >= 4, 'Must have at least 4 cross-character dialogues');

  ['pet', 'talk', 'play', 'question', 'sleep', 'dismiss'].forEach(type => {
    assert(KAGE_DIALOGUES.interactions[type].length > 0, `Kage interaction ${type} missing`);
    assert(KAGE_CHAN_DIALOGUES.interactions[type].length > 0, `Kage-chan interaction ${type} missing`);
  });
  console.log('  -> Dialogue Integrity PASS');

  // 5. Personality Engine Interaction Test
  console.log('[Test 5] Testing Personality Engine Interactions...');
  personalityEngine.init();
  const petResult = personalityEngine.handleInteraction('kage', 'pet');
  assert(petResult !== null, 'Pet interaction should return result');
  assert(petResult.mood === 'happy', 'Pet interaction should result in happy mood');
  assert(typeof petResult.text === 'string' && petResult.text.length > 0, 'Pet result should have text');

  const playResult = personalityEngine.handleInteraction('kage-chan', 'play');
  assert(playResult !== null, 'Play interaction should return result');
  assert(playResult.mood === 'excited', 'Play interaction should result in excited mood');
  console.log('  -> Personality Engine PASS');

  // 6. Interaction History & Logging Test
  console.log('[Test 6] Testing Interaction History Logging...');
  const count = db.getInteractionCount();
  assert(count >= 2, `Interaction count should be at least 2, got ${count}`);
  const recent = db.getRecentInteractions(5);
  assert(recent.length >= 2, 'Recent interactions should return logged events');
  console.log('  -> Interaction History PASS');

  // 7. Relationship Engine Test
  console.log('[Test 7] Testing Cross-Character Relationship Engine...');
  const canCross = relationshipEngine.canPerformCrossInteraction();
  assert(typeof canCross === 'boolean', 'canPerformCrossInteraction should return boolean');
  console.log('  -> Relationship Engine PASS');

  // 8. Asset Verification Test
  console.log('[Test 8] Testing Application Assets...');
  const trayIcon = path.join(__dirname, '../src/renderer/assets/icons/tray-icon.png');
  const appIco = path.join(__dirname, '../src/renderer/assets/icons/icon.ico');
  const wasmFile = path.join(__dirname, '../src/renderer/assets/sql-wasm.wasm');
  const kageAsset = path.join(__dirname, '../src/renderer/characters/kage/assets/kage-main.png');
  const chanAsset = path.join(__dirname, '../src/renderer/characters/kage-chan/assets/kage-chan-main.png');

  assert(fs.existsSync(trayIcon), 'tray-icon.png must exist');
  assert(fs.existsSync(appIco), 'icon.ico must exist');
  assert(fs.existsSync(wasmFile), 'sql-wasm.wasm must exist');
  assert(fs.existsSync(kageAsset), 'kage-main.png character asset must exist');
  assert(fs.existsSync(chanAsset), 'kage-chan-main.png character asset must exist');
  console.log('  -> Asset Verification PASS');

  // Cleanup
  personalityEngine.destroy();
  db.close();
  if (fs.existsSync(testDataDir)) {
    fs.rmSync(testDataDir, { recursive: true, force: true });
  }

  console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

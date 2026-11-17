const { BrowserWindow, screen } = require('electron');
const path = require('path');
const db = require('../database/db');

class CompanionWindowFactory {
  static create(characterId) {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    const charData = db.getCharacter(characterId) || {};
    const winWidth = 260;
    const winHeight = 280;

    // Calculate default positions if not set
    let defaultX, defaultY;
    if (characterId === 'kage') {
      defaultX = Math.round(screenWidth - winWidth - 30);
      defaultY = Math.round(screenHeight - winHeight - 30);
    } else {
      defaultX = Math.round(screenWidth - winWidth * 2 - 50);
      defaultY = Math.round(screenHeight - winHeight - 30);
    }

    let posX = (charData.x !== undefined && charData.x >= 0) ? charData.x : defaultX;
    let posY = (charData.y !== undefined && charData.y >= 0) ? charData.y : defaultY;

    // Bounds checking against active screens
    const inBounds = screen.getAllDisplays().some(disp => {
      const b = disp.bounds;
      return (
        posX >= b.x &&
        posX <= b.x + b.width - 50 &&
        posY >= b.y &&
        posY <= b.y + b.height - 50
      );
    });

    if (!inBounds) {
      posX = defaultX;
      posY = defaultY;
    }

    const win = new BrowserWindow({
      width: winWidth,
      height: winHeight,
      x: posX,
      y: posY,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      hasShadow: false,
      skipTaskbar: true,
      resizable: false,
      maximizable: false,
      fullscreenable: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../preload/companionPreload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
        backgroundThrottling: false // Keep animations active even when backgrounded
      }
    });

    // Windows always on top level
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    const htmlPath = path.join(
      __dirname,
      `../../renderer/characters/${characterId}/index.html`
    );
    win.loadFile(htmlPath);

    win.once('ready-to-show', () => {
      if (charData.enabled !== 0) {
        win.show();
      }
    });

    // Save position on move
    win.on('moved', () => {
      const [newX, newY] = win.getPosition();
      db.updateCharacter(characterId, { x: newX, y: newY });
    });

    return win;
  }
}

module.exports = CompanionWindowFactory;

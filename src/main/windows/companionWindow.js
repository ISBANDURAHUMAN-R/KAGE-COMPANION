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

    // Calculate default positions prominently in bottom-right desktop
    let defaultX, defaultY;
    if (characterId === 'kage') {
      defaultX = Math.round(screenWidth - winWidth * 2 - 40);
      defaultY = Math.round(screenHeight - winHeight - 40);
    } else {
      defaultX = Math.round(screenWidth - winWidth - 20);
      defaultY = Math.round(screenHeight - winHeight - 40);
    }

    let posX = (charData.x !== undefined && charData.x >= 0) ? charData.x : defaultX;
    let posY = (charData.y !== undefined && charData.y >= 0) ? charData.y : defaultY;

    // Bounds checking against active screens
    const inBounds = screen.getAllDisplays().some(disp => {
      const b = disp.bounds;
      return (
        posX >= b.x - 20 &&
        posX <= b.x + b.width - 60 &&
        posY >= b.y - 20 &&
        posY <= b.y + b.height - 60
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
      skipTaskbar: false,
      icon: path.join(__dirname, '../../renderer/assets/icons/icon.ico'),
      resizable: false,
      maximizable: false,
      fullscreenable: false,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/companionPreload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
        backgroundThrottling: false
      }
    });

    win.setAlwaysOnTop(true);

    const htmlPath = path.join(
      __dirname,
      `../../renderer/characters/${characterId}/index.html`
    );
    win.loadFile(htmlPath);

    win.show();
    win.focus();

    // Save position on move
    win.on('moved', () => {
      const [newX, newY] = win.getPosition();
      db.updateCharacter(characterId, { x: newX, y: newY });
    });

    return win;
  }
}

module.exports = CompanionWindowFactory;

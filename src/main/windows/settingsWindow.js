const { BrowserWindow } = require('electron');
const path = require('path');

let settingsWin = null;

function createSettingsWindow(defaultTab = 'dashboard') {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.show();
    settingsWin.focus();
    if (defaultTab) {
      settingsWin.webContents.send('settings:switch-tab', defaultTab);
    }
    return settingsWin;
  }

  settingsWin = new BrowserWindow({
    width: 980,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    title: 'VOIDKAGE — Desktop Companions Dashboard',
    backgroundColor: '#0a0a0c',
    frame: true,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/settingsPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  const htmlPath = path.join(__dirname, '../../renderer/settings/index.html');
  settingsWin.loadFile(htmlPath);

  settingsWin.once('ready-to-show', () => {
    settingsWin.show();
    if (defaultTab) {
      settingsWin.webContents.send('settings:switch-tab', defaultTab);
    }
  });

  settingsWin.on('close', (e) => {
    // When user closes settings, don't quit the whole app, just close this window
    settingsWin = null;
  });

  return settingsWin;
}

function getSettingsWindow() {
  return (settingsWin && !settingsWin.isDestroyed()) ? settingsWin : null;
}

module.exports = {
  createSettingsWindow,
  getSettingsWindow
};

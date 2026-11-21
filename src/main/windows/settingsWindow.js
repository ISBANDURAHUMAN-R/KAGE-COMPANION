const { BrowserWindow } = require('electron');
const path = require('path');

let settingsWin = null;

function createSettingsWindow(defaultTab = 'characters') {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.show();
    settingsWin.focus();
    if (defaultTab) {
      settingsWin.webContents.send('settings:switch-tab', defaultTab);
    }
    return settingsWin;
  }

  settingsWin = new BrowserWindow({
    width: 920,
    height: 640,
    minWidth: 760,
    minHeight: 520,
    title: 'KAGE COMPANION — Settings',
    backgroundColor: '#0a0a0c',
    icon: path.join(__dirname, '../../renderer/assets/icons/icon.ico'),
    frame: true,
    autoHideMenuBar: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/settingsPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  const htmlPath = path.join(__dirname, '../../renderer/settings/index.html');
  settingsWin.loadFile(htmlPath);

  settingsWin.show();
  settingsWin.focus();

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

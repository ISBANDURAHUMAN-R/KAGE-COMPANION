const { BrowserWindow } = require('electron');
const path = require('path');

let welcomeWin = null;

function createWelcomeWindow(onComplete) {
  if (welcomeWin && !welcomeWin.isDestroyed()) {
    welcomeWin.show();
    welcomeWin.focus();
    return welcomeWin;
  }

  welcomeWin = new BrowserWindow({
    width: 720,
    height: 580,
    resizable: false,
    maximizable: false,
    title: 'KAGE COMPANION — Welcome',
    backgroundColor: '#0a0a0c',
    icon: path.join(__dirname, '../../renderer/assets/icons/icon.ico'),
    frame: false,
    transparent: false,
    center: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/settingsPreload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const htmlPath = path.join(__dirname, '../../renderer/welcome/welcome.html');
  welcomeWin.loadFile(htmlPath);

  welcomeWin.once('ready-to-show', () => {
    welcomeWin.show();
  });

  welcomeWin.on('closed', () => {
    welcomeWin = null;
    if (onComplete) onComplete();
  });

  return welcomeWin;
}

module.exports = {
  createWelcomeWindow
};

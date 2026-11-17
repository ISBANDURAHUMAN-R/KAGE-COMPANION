const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen, shell } = require('electron');
const path = require('path');
const db = require('./database/db');
const personalityEngine = require('./engine/personalityEngine');
const autonomousEngine = require('./engine/autonomousEngine');
const CompanionWindowFactory = require('./windows/companionWindow');
const { createSettingsWindow, getSettingsWindow } = require('./windows/settingsWindow');
const { createWelcomeWindow } = require('./windows/welcomeWindow');

// Ensure single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

// Window store
const windows = {
  kage: null,
  'kage-chan': null
};

let tray = null;
let isQuitting = false;

// Check launch arguments
const isStartupLaunch = process.argv.includes('--startup') || process.argv.includes('--hidden');

// Window manager interface for engines
const windowManager = {
  sendToCompanion: (charId, channel, data) => {
    const win = windows[charId];
    if (win && !win.isDestroyed() && win.isVisible()) {
      win.webContents.send(channel, data);
    }
  },
  broadcastToCompanions: (channel, data) => {
    Object.values(windows).forEach(win => {
      if (win && !win.isDestroyed() && win.isVisible()) {
        win.webContents.send(channel, data);
      }
    });
  }
};

async function initializeApp() {
  // 1. Initialize SQLite database
  const userDataPath = app.getPath('userData');
  await db.init(userDataPath);

  // 2. Configure Windows auto-launch setting if enabled
  configureAutoLaunch();

  // 3. Create tray icon
  createTray();

  // 4. Check if first launch
  const firstLaunchDone = db.getSetting('first_launch_done', 'false') === 'true';

  if (!firstLaunchDone && !isStartupLaunch) {
    createWelcomeWindow(() => {
      db.setSetting('first_launch_done', 'true');
      launchCompanions();
    });
  } else {
    launchCompanions();
  }

  // 5. Start autonomous behavior loop
  autonomousEngine.start(windowManager);
}

function launchCompanions() {
  const characters = db.getAllCharacters();
  characters.forEach(char => {
    if (char.enabled) {
      showCompanionWindow(char.id);
    }
  });
}

function showCompanionWindow(charId) {
  if (windows[charId] && !windows[charId].isDestroyed()) {
    windows[charId].show();
    return;
  }
  windows[charId] = CompanionWindowFactory.create(charId);
}

function hideCompanionWindow(charId) {
  if (windows[charId] && !windows[charId].isDestroyed()) {
    windows[charId].hide();
  }
}

function configureAutoLaunch() {
  const enabled = db.getSetting('auto_launch', 'true') === 'true';
  try {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      openAsHidden: true,
      path: process.execPath,
      args: ['--startup']
    });
  } catch (err) {
    console.error('Failed to configure Windows auto-launch:', err);
  }
}

function createTray() {
  const trayIconPath = path.join(__dirname, '../renderer/assets/icons/tray-icon.png');
  const trayImage = nativeImage.createFromPath(trayIconPath);
  tray = new Tray(trayImage);
  tray.setToolTip('VOIDKAGE — Desktop Companions');

  updateTrayMenu();

  tray.on('double-click', () => {
    createSettingsWindow('dashboard');
  });
}

function updateTrayMenu() {
  if (!tray) return;

  const kage = db.getCharacter('kage') || { enabled: 1 };
  const kageChan = db.getCharacter('kage-chan') || { enabled: 1 };
  const currentMode = db.getSetting('desktop_mode', 'normal');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'VOIDKAGE Companions', enabled: false },
    { type: 'separator' },
    {
      label: 'Open Dashboard / Settings',
      click: () => createSettingsWindow('dashboard')
    },
    { type: 'separator' },
    {
      label: 'Show KAGE',
      type: 'checkbox',
      checked: Boolean(kage.enabled),
      click: (item) => {
        db.updateCharacter('kage', { enabled: item.checked ? 1 : 0 });
        if (item.checked) showCompanionWindow('kage');
        else hideCompanionWindow('kage');
        notifySettingsUpdate();
      }
    },
    {
      label: 'Show KAGE-CHAN',
      type: 'checkbox',
      checked: Boolean(kageChan.enabled),
      click: (item) => {
        db.updateCharacter('kage-chan', { enabled: item.checked ? 1 : 0 });
        if (item.checked) showCompanionWindow('kage-chan');
        else hideCompanionWindow('kage-chan');
        notifySettingsUpdate();
      }
    },
    { type: 'separator' },
    {
      label: 'Desktop Mode',
      submenu: [
        {
          label: 'Normal Mode',
          type: 'radio',
          checked: currentMode === 'normal',
          click: () => setDesktopMode('normal')
        },
        {
          label: 'Focus Mode (Quiet Breaks)',
          type: 'radio',
          checked: currentMode === 'focus',
          click: () => setDesktopMode('focus')
        },
        {
          label: 'Active Mode (High Energy)',
          type: 'radio',
          checked: currentMode === 'active',
          click: () => setDesktopMode('active')
        },
        {
          label: 'Quiet Mode (Silent)',
          type: 'radio',
          checked: currentMode === 'quiet',
          click: () => setDesktopMode('quiet')
        }
      ]
    },
    { type: 'separator' },
    {
      label: 'Reset Desktop Positions',
      click: () => resetPositions()
    },
    { type: 'separator' },
    {
      label: 'Exit VOIDKAGE',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

function setDesktopMode(mode) {
  db.setSetting('desktop_mode', mode);
  autonomousEngine.restartTimer();
  updateTrayMenu();
  notifySettingsUpdate();
}

function resetPositions() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const kageX = Math.round(width - 290);
  const kageY = Math.round(height - 310);
  const chanX = Math.round(width - 560);
  const chanY = Math.round(height - 310);

  db.updateCharacter('kage', { x: kageX, y: kageY });
  db.updateCharacter('kage-chan', { x: chanX, y: chanY });

  if (windows.kage && !windows.kage.isDestroyed()) {
    windows.kage.setPosition(kageX, kageY);
    windows.kage.show();
  }
  if (windows['kage-chan'] && !windows['kage-chan'].isDestroyed()) {
    windows['kage-chan'].setPosition(chanX, chanY);
    windows['kage-chan'].show();
  }
}

function notifySettingsUpdate() {
  const sWin = getSettingsWindow();
  if (sWin) {
    sWin.webContents.send('settings:updated');
  }
}

// ------------------- IPC HANDLERS -------------------

// Companion Interaction
ipcMain.handle('companion:interact', async (event, { characterId, type }) => {
  const result = personalityEngine.handleInteraction(characterId, type);
  notifySettingsUpdate();
  return result;
});

// Get character config
ipcMain.handle('companion:get-config', (event, characterId) => {
  const char = db.getCharacter(characterId) || {};
  const settings = db.getAllSettings();
  return {
    character: char,
    settings
  };
});

// Save position
ipcMain.handle('companion:save-position', (event, { characterId, x, y }) => {
  db.updateCharacter(characterId, { x, y });
});

// Smooth move by delta
ipcMain.handle('companion:move-by', (event, { characterId, dx, dy }) => {
  const win = windows[characterId];
  if (win && !win.isDestroyed()) {
    const [currX, currY] = win.getPosition();
    const newX = currX + dx;
    const newY = currY + dy;
    win.setPosition(newX, newY);
    return { x: newX, y: newY };
  }
  return null;
});

// Hide companion
ipcMain.handle('companion:hide', (event, characterId) => {
  db.updateCharacter(characterId, { enabled: 0 });
  hideCompanionWindow(characterId);
  updateTrayMenu();
  notifySettingsUpdate();
});

// Open Settings
ipcMain.handle('window:open-settings', (event, tab) => {
  createSettingsWindow(tab || 'dashboard');
});

// Settings Handlers
ipcMain.handle('settings:get-all', () => {
  return db.getAllSettings();
});

ipcMain.handle('settings:save', (event, { key, value }) => {
  db.setSetting(key, value);
  if (key === 'interaction_interval' || key === 'desktop_mode') {
    autonomousEngine.restartTimer();
  }
  if (key === 'auto_launch') {
    configureAutoLaunch();
  }
  // Broadcast update to all companion windows
  windowManager.broadcastToCompanions('companion:update-config', { key, value });
  updateTrayMenu();
  return true;
});

ipcMain.handle('settings:get-characters', () => {
  return db.getAllCharacters();
});

ipcMain.handle('settings:update-character', (event, { id, fields }) => {
  db.updateCharacter(id, fields);
  if (fields.enabled !== undefined) {
    if (fields.enabled) showCompanionWindow(id);
    else hideCompanionWindow(id);
    updateTrayMenu();
  }
  if (fields.scale !== undefined || fields.opacity !== undefined) {
    windowManager.sendToCompanion(id, 'companion:update-config', fields);
  }
  return true;
});

ipcMain.handle('settings:get-stats', () => {
  return {
    kageInteractions: db.getInteractionCount('kage'),
    kageChanInteractions: db.getInteractionCount('kage-chan'),
    totalInteractions: db.getInteractionCount(),
    characters: db.getAllCharacters(),
    desktopMode: db.getSetting('desktop_mode', 'normal')
  };
});

ipcMain.handle('settings:get-recent-interactions', (event, limit = 10) => {
  return db.getRecentInteractions(limit);
});

ipcMain.handle('settings:clear-history', () => {
  db.clearHistory();
  return true;
});

ipcMain.handle('settings:reset-positions', () => {
  resetPositions();
  return true;
});

ipcMain.handle('settings:set-desktop-mode', (event, mode) => {
  setDesktopMode(mode);
  return true;
});

ipcMain.handle('settings:get-auto-launch', () => {
  const settings = app.getLoginItemSettings();
  return settings.openAtLogin;
});

ipcMain.handle('settings:set-auto-launch', (event, enabled) => {
  db.setSetting('auto_launch', enabled ? 'true' : 'false');
  configureAutoLaunch();
  return true;
});

ipcMain.handle('settings:open-user-data', () => {
  shell.openPath(app.getPath('userData'));
  return true;
});

ipcMain.handle('app:quit', () => {
  isQuitting = true;
  app.quit();
});

// App Lifecycle
app.whenReady().then(initializeApp);

app.on('second-instance', () => {
  // If user launches second instance, open dashboard or show characters
  createSettingsWindow('dashboard');
  Object.values(windows).forEach(win => {
    if (win && !win.isDestroyed()) {
      win.show();
    }
  });
});

app.on('window-all-closed', (e) => {
  // Keep app running in tray even if all windows are closed
  e.preventDefault();
});

app.on('before-quit', () => {
  isQuitting = true;
  autonomousEngine.stop();
  db.close();
});

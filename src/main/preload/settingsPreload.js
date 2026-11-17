const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('settingsAPI', {
  getSettings: () => ipcRenderer.invoke('settings:get-all'),
  saveSetting: (key, value) => ipcRenderer.invoke('settings:save', { key, value }),
  getCharacters: () => ipcRenderer.invoke('settings:get-characters'),
  updateCharacter: (id, fields) => ipcRenderer.invoke('settings:update-character', { id, fields }),
  getStats: () => ipcRenderer.invoke('settings:get-stats'),
  getRecentInteractions: (limit) => ipcRenderer.invoke('settings:get-recent-interactions', limit),
  clearHistory: () => ipcRenderer.invoke('settings:clear-history'),
  resetPositions: () => ipcRenderer.invoke('settings:reset-positions'),
  setDesktopMode: (mode) => ipcRenderer.invoke('settings:set-desktop-mode', mode),
  testSound: (soundName, volume, pitch) => ipcRenderer.invoke('audio:test-sound', { soundName, volume, pitch }),
  getAutoLaunchStatus: () => ipcRenderer.invoke('settings:get-auto-launch'),
  setAutoLaunch: (enabled) => ipcRenderer.invoke('settings:set-auto-launch', enabled),
  openUserDataFolder: () => ipcRenderer.invoke('settings:open-user-data'),
  quitApp: () => ipcRenderer.invoke('app:quit'),
  
  on: (channel, callback) => {
    const validChannels = ['settings:updated', 'companion:state-changed'];
    if (validChannels.includes(channel)) {
      const sub = (event, ...args) => callback(...args);
      ipcRenderer.on(channel, sub);
      return () => ipcRenderer.removeListener(channel, sub);
    }
  }
});

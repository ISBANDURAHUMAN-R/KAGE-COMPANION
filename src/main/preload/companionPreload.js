const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('companionAPI', {
  // IPC listeners
  on: (channel, callback) => {
    const validChannels = [
      'companion:say',
      'companion:play-animation',
      'companion:update-config',
      'companion:set-mood',
      'companion:reset-position'
    ];
    if (validChannels.includes(channel)) {
      const subscription = (event, ...args) => callback(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  },

  // IPC invocations
  interact: (characterId, type) => ipcRenderer.invoke('companion:interact', { characterId, type }),
  getConfig: (characterId) => ipcRenderer.invoke('companion:get-config', characterId),
  savePosition: (characterId, x, y) => ipcRenderer.invoke('companion:save-position', { characterId, x, y }),
  openSettings: (tab) => ipcRenderer.invoke('window:open-settings', tab),
  hideCharacter: (characterId) => ipcRenderer.invoke('companion:hide', characterId),
  
  // Dragging IPC
  setPosition: (characterId, x, y) => ipcRenderer.invoke('companion:set-position', { characterId, x, y }),
  setPositionFast: (characterId, x, y) => ipcRenderer.send('companion:set-position-fast', { characterId, x, y }),
  moveWindow: (characterId, dx, dy) => ipcRenderer.invoke('companion:move-by', { characterId, dx, dy }),
  moveByFast: (characterId, dx, dy) => ipcRenderer.send('companion:move-by-fast', { characterId, dx, dy }),
  
  // Sound trigger
  playSound: (soundName) => ipcRenderer.invoke('audio:play', soundName)
});

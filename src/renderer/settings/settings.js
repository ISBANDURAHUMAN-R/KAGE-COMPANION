/**
 * KAGE COMPANION Settings & Companion Controls
 * Lightweight, personal desktop companion controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Navigation tabs
  const navItems = document.querySelectorAll('.nav-item');
  const panes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('page-title');

  const tabTitles = {
    characters: 'Companion Controls',
    interactions: 'Desktop Behavior',
    audio: 'Audio Settings',
    startup: 'Startup & Privacy',
    about: 'About KAGE COMPANION'
  };

  function switchTab(tabId) {
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) item.classList.add('active');
      else item.classList.remove('active');
    });

    panes.forEach(pane => {
      if (pane.id === `pane-${tabId}`) pane.classList.add('active');
      else pane.classList.remove('active');
    });

    if (pageTitle && tabTitles[tabId]) {
      pageTitle.textContent = tabTitles[tabId];
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Listen for main process tab switch
  if (window.settingsAPI && window.settingsAPI.on) {
    window.settingsAPI.on('settings:switch-tab', (tab) => {
      switchTab(tab);
    });
    window.settingsAPI.on('settings:updated', () => {
      refreshData();
    });
  }

  // Initial load
  await refreshData();

  async function refreshData() {
    if (!window.settingsAPI) return;

    try {
      const settings = await window.settingsAPI.getSettings();
      const stats = await window.settingsAPI.getStats();
      const isAutoLaunch = await window.settingsAPI.getAutoLaunchStatus();

      // Characters configuration
      if (stats && stats.characters) {
        const kageChar = stats.characters.find(c => c.id === 'kage');
        if (kageChar) {
          const enableKage = document.getElementById('char-enable-kage');
          if (enableKage) enableKage.checked = Boolean(kageChar.enabled);
          const rangeKage = document.getElementById('range-kage-scale');
          if (rangeKage) rangeKage.value = kageChar.scale || 1.0;
          const valKage = document.getElementById('val-kage-scale');
          if (valKage) valKage.textContent = `${Math.round((kageChar.scale || 1.0) * 100)}%`;
        }

        const chanChar = stats.characters.find(c => c.id === 'kage-chan');
        if (chanChar) {
          const enableChan = document.getElementById('char-enable-chan');
          if (enableChan) enableChan.checked = Boolean(chanChar.enabled);
          const rangeChan = document.getElementById('range-chan-scale');
          if (rangeChan) rangeChan.value = chanChar.scale || 1.0;
          const valChan = document.getElementById('val-chan-scale');
          if (valChan) valChan.textContent = `${Math.round((chanChar.scale || 1.0) * 100)}%`;
        }
      }

      // Settings fields
      if (settings) {
        const rangeInterval = document.getElementById('range-interval');
        if (rangeInterval) rangeInterval.value = settings.interaction_interval || 45;
        const valInterval = document.getElementById('val-interval');
        if (valInterval) valInterval.textContent = `${settings.interaction_interval || 45}s`;

        const crossToggle = document.getElementById('int-cross-enable');
        if (crossToggle) crossToggle.checked = settings.cross_interactions === 'true';

        const motionToggle = document.getElementById('int-motion-enable');
        if (motionToggle) motionToggle.checked = settings.silent_motion !== 'false';

        const audioToggle = document.getElementById('audio-enable');
        if (audioToggle) audioToggle.checked = settings.sound_enabled === 'true';

        const rangeVolume = document.getElementById('range-volume');
        if (rangeVolume) rangeVolume.value = settings.sound_volume || 0.7;
        const valVolume = document.getElementById('val-volume');
        if (valVolume) valVolume.textContent = `${Math.round((settings.sound_volume || 0.7) * 100)}%`;

        const rangePitch = document.getElementById('range-pitch');
        if (rangePitch) rangePitch.value = settings.voice_pitch || 1.0;
        const valPitch = document.getElementById('val-pitch');
        if (valPitch) valPitch.textContent = `${settings.voice_pitch || 1.0}x`;

        // Update local synthesizer instance for sound preview
        if (window.soundSynth) {
          window.soundSynth.setEnabled(settings.sound_enabled === 'true');
          window.soundSynth.setVolume(parseFloat(settings.sound_volume) || 0.7);
          window.soundSynth.setPitch(parseFloat(settings.voice_pitch) || 1.0);
        }
      }

      // Startup status
      const startupToggle = document.getElementById('startup-toggle');
      if (startupToggle) startupToggle.checked = Boolean(isAutoLaunch);
      const startupStatusText = document.getElementById('startup-status-text');
      if (startupStatusText) startupStatusText.textContent = isAutoLaunch ? 'Active' : 'Disabled';
    } catch (err) {
      console.error('Error refreshing settings data:', err);
    }
  }

  // ------------------- EVENT HANDLERS -------------------

  // Reset Positions
  const btnResetPos = document.getElementById('btn-reset-pos');
  if (btnResetPos) {
    btnResetPos.addEventListener('click', async () => {
      await window.settingsAPI.resetPositions();
      if (window.soundSynth) window.soundSynth.play('play');
    });
  }

  // Character Toggles
  const setupCharToggle = (elementId, charId) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.addEventListener('change', async (e) => {
      await window.settingsAPI.updateCharacter(charId, { enabled: e.target.checked ? 1 : 0 });
      refreshData();
    });
  };
  setupCharToggle('char-enable-kage', 'kage');
  setupCharToggle('char-enable-chan', 'kage-chan');

  // Scale Sliders
  const setupScaleSlider = (rangeId, labelId, charId) => {
    const range = document.getElementById(rangeId);
    if (!range) return;
    range.addEventListener('input', async (e) => {
      const val = parseFloat(e.target.value);
      const label = document.getElementById(labelId);
      if (label) label.textContent = `${Math.round(val * 100)}%`;
      await window.settingsAPI.updateCharacter(charId, { scale: val });
    });
  };
  setupScaleSlider('range-kage-scale', 'val-kage-scale', 'kage');
  setupScaleSlider('range-chan-scale', 'val-chan-scale', 'kage-chan');

  // Reset Scales to 100%
  const btnResetScales = document.getElementById('btn-reset-scales');
  if (btnResetScales) {
    btnResetScales.addEventListener('click', async () => {
      await window.settingsAPI.updateCharacter('kage', { scale: 1.0 });
      await window.settingsAPI.updateCharacter('kage-chan', { scale: 1.0 });
      refreshData();
    });
  }

  // Behavior Toggles & Interval
  const rangeInterval = document.getElementById('range-interval');
  if (rangeInterval) {
    rangeInterval.addEventListener('input', async (e) => {
      const val = e.target.value;
      const label = document.getElementById('val-interval');
      if (label) label.textContent = `${val}s`;
      await window.settingsAPI.saveSetting('interaction_interval', val);
    });
  }

  const crossToggle = document.getElementById('int-cross-enable');
  if (crossToggle) {
    crossToggle.addEventListener('change', async (e) => {
      await window.settingsAPI.saveSetting('cross_interactions', e.target.checked ? 'true' : 'false');
    });
  }

  const motionToggle = document.getElementById('int-motion-enable');
  if (motionToggle) {
    motionToggle.addEventListener('change', async (e) => {
      await window.settingsAPI.saveSetting('silent_motion', e.target.checked ? 'true' : 'false');
    });
  }

  // Audio Controls
  const audioEnable = document.getElementById('audio-enable');
  if (audioEnable) {
    audioEnable.addEventListener('change', async (e) => {
      await window.settingsAPI.saveSetting('sound_enabled', e.target.checked ? 'true' : 'false');
      if (window.soundSynth) window.soundSynth.setEnabled(e.target.checked);
    });
  }

  const rangeVolume = document.getElementById('range-volume');
  if (rangeVolume) {
    rangeVolume.addEventListener('input', async (e) => {
      const val = e.target.value;
      const label = document.getElementById('val-volume');
      if (label) label.textContent = `${Math.round(val * 100)}%`;
      await window.settingsAPI.saveSetting('sound_volume', val);
      if (window.soundSynth) window.soundSynth.setVolume(val);
    });
  }

  const rangePitch = document.getElementById('range-pitch');
  if (rangePitch) {
    rangePitch.addEventListener('input', async (e) => {
      const val = e.target.value;
      const label = document.getElementById('val-pitch');
      if (label) label.textContent = `${val}x`;
      await window.settingsAPI.saveSetting('voice_pitch', val);
      if (window.soundSynth) window.soundSynth.setPitch(val);
    });
  }

  // Audio Test Cues
  const bindAudioTest = (btnId, soundName) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (window.soundSynth) window.soundSynth.play(soundName);
    });
  };
  bindAudioTest('test-chirp', 'talk');
  bindAudioTest('test-pet', 'pet');
  bindAudioTest('test-play', 'play');
  bindAudioTest('test-sleep', 'sleep');

  // Startup Toggle
  const startupToggle = document.getElementById('startup-toggle');
  if (startupToggle) {
    startupToggle.addEventListener('change', async (e) => {
      await window.settingsAPI.setAutoLaunch(e.target.checked);
      const statusText = document.getElementById('startup-status-text');
      if (statusText) statusText.textContent = e.target.checked ? 'Active' : 'Disabled';
    });
  }

  // Open User Data Folder
  const btnOpenFolder = document.getElementById('btn-open-folder');
  if (btnOpenFolder) {
    btnOpenFolder.addEventListener('click', async () => {
      await window.settingsAPI.openUserDataFolder();
    });
  }

  // Clear History
  const btnClearHistory = document.getElementById('btn-clear-history');
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', async () => {
      if (confirm('Clear local companion memory and interaction history?')) {
        await window.settingsAPI.clearHistory();
        refreshData();
      }
    });
  }

  // Exit App
  const btnQuit = document.getElementById('btn-quit');
  if (btnQuit) {
    btnQuit.addEventListener('click', async () => {
      await window.settingsAPI.quitApp();
    });
  }
});

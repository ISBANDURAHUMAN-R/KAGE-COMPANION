/**
 * VOIDKAGE Settings & Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Navigation
  const navItems = document.querySelectorAll('.nav-item');
  const panes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('page-title');

  const tabTitles = {
    dashboard: 'Dashboard Overview',
    characters: 'Character Management',
    appearance: 'Visual Atmosphere',
    personality: 'Personality & Affection',
    moods: 'Expression & Mood Overrides',
    interactions: 'Autonomous Intervals & Behaviors',
    audio: 'Audio & Voice Synthesis',
    startup: 'Windows Startup Configuration',
    privacy: 'Privacy & SQLite Engine',
    about: 'About VOIDKAGE Companions'
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

  // Load initial settings and telemetry
  await refreshData();

  async function refreshData() {
    if (!window.settingsAPI) return;

    try {
      const settings = await window.settingsAPI.getSettings();
      const stats = await window.settingsAPI.getStats();
      const isAutoLaunch = await window.settingsAPI.getAutoLaunchStatus();

      // Update Dashboard stats
      if (stats) {
        document.getElementById('current-mode-pill').textContent = `Mode: ${stats.desktopMode || 'Normal'}`;

        const kageChar = stats.characters.find(c => c.id === 'kage');
        if (kageChar) {
          document.getElementById('dash-kage-mood').textContent = capitalize(kageChar.mood);
          document.getElementById('dash-kage-aff').textContent = `${kageChar.affection}%`;
          document.getElementById('kage-aff-bar').style.width = `${kageChar.affection}%`;
          document.getElementById('dash-kage-energy').textContent = `${kageChar.energy}%`;
          document.getElementById('kage-energy-bar').style.width = `${kageChar.energy}%`;
          document.getElementById('dash-kage-mischief').textContent = `${kageChar.mischief}%`;
          document.getElementById('kage-mischief-bar').style.width = `${kageChar.mischief}%`;
          document.getElementById('dash-toggle-kage').checked = Boolean(kageChar.enabled);
          document.getElementById('char-enable-kage').checked = Boolean(kageChar.enabled);
          document.getElementById('range-kage-scale').value = kageChar.scale || 1.0;
          document.getElementById('val-kage-scale').textContent = `${Math.round((kageChar.scale || 1.0) * 100)}%`;
        }

        const chanChar = stats.characters.find(c => c.id === 'kage-chan');
        if (chanChar) {
          document.getElementById('dash-chan-mood').textContent = capitalize(chanChar.mood);
          document.getElementById('dash-chan-aff').textContent = `${chanChar.affection}%`;
          document.getElementById('chan-aff-bar').style.width = `${chanChar.affection}%`;
          document.getElementById('dash-chan-energy').textContent = `${chanChar.energy}%`;
          document.getElementById('chan-energy-bar').style.width = `${chanChar.energy}%`;
          document.getElementById('dash-chan-mischief').textContent = `${chanChar.mischief}%`;
          document.getElementById('chan-mischief-bar').style.width = `${chanChar.mischief}%`;
          document.getElementById('dash-toggle-chan').checked = Boolean(chanChar.enabled);
          document.getElementById('char-enable-chan').checked = Boolean(chanChar.enabled);
          document.getElementById('range-chan-scale').value = chanChar.scale || 1.0;
          document.getElementById('val-chan-scale').textContent = `${Math.round((chanChar.scale || 1.0) * 100)}%`;
        }

        document.getElementById('dash-kage-count').textContent = stats.kageInteractions || 0;
        document.getElementById('dash-chan-count').textContent = stats.kageChanInteractions || 0;

        // Set mode buttons active state
        document.querySelectorAll('.mode-btn').forEach(btn => {
          if (btn.getAttribute('data-mode') === stats.desktopMode) btn.classList.add('active');
          else btn.classList.remove('active');
        });
      }

      // Update form fields
      if (settings) {
        document.getElementById('app-enable-glow').checked = settings.theme_glow === 'true';
        document.getElementById('range-glow-intensity').value = settings.glow_intensity || 0.8;
        document.getElementById('val-glow-intensity').textContent = `${Math.round((settings.glow_intensity || 0.8) * 100)}%`;

        document.getElementById('select-bubble-style').value = settings.bubble_style || 'voidkage';
        document.getElementById('range-interval').value = settings.interaction_interval || 30;
        document.getElementById('val-interval').textContent = `${settings.interaction_interval || 30}s`;

        document.getElementById('audio-enable').checked = settings.sound_enabled === 'true';
        document.getElementById('range-volume').value = settings.sound_volume || 0.7;
        document.getElementById('val-volume').textContent = `${Math.round((settings.sound_volume || 0.7) * 100)}%`;
        document.getElementById('range-pitch').value = settings.voice_pitch || 1.0;
        document.getElementById('val-pitch').textContent = `${settings.voice_pitch || 1.0}x`;

        // Update local synthesizer instance for preview
        if (window.soundSynth) {
          window.soundSynth.setEnabled(settings.sound_enabled === 'true');
          window.soundSynth.setVolume(parseFloat(settings.sound_volume) || 0.7);
          window.soundSynth.setPitch(parseFloat(settings.voice_pitch) || 1.0);
        }
      }

      // Startup
      document.getElementById('startup-toggle').checked = Boolean(isAutoLaunch);
      document.getElementById('startup-status-text').textContent = isAutoLaunch ? 'Registered & Active' : 'Disabled';

      // Load interaction logs
      loadRecentLogs();
    } catch (err) {
      console.error('Error refreshing settings data:', err);
    }
  }

  async function loadRecentLogs() {
    const logs = await window.settingsAPI.getRecentInteractions(12);
    const tbody = document.getElementById('logs-tbody');
    tbody.innerHTML = '';

    if (!logs || logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 20px;">No interaction history yet. Interact with Kage or Kage-chan on your desktop!</td></tr>`;
      return;
    }

    logs.forEach(log => {
      const tr = document.createElement('tr');
      const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const charName = log.character_id === 'kage' ? 'KAGE' : 'KAGE-CHAN';
      tr.innerHTML = `
        <td><span class="code-span">${timeStr}</span></td>
        <td><strong>${charName}</strong></td>
        <td><span class="vk-badge vk-badge-red">${log.interaction_type}</span></td>
        <td>${escapeHtml(log.dialogue || '')}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ------------------- EVENT HANDLERS -------------------

  // Operating Modes
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const mode = btn.getAttribute('data-mode');
      await window.settingsAPI.setDesktopMode(mode);
      if (window.soundSynth) window.soundSynth.play('click');
      refreshData();
    });
  });

  // Reset Positions
  document.getElementById('btn-reset-pos').addEventListener('click', async () => {
    await window.settingsAPI.resetPositions();
    if (window.soundSynth) window.soundSynth.play('notify');
  });

  // Toggles for characters
  const setupCharToggle = (elementId, charId) => {
    document.getElementById(elementId).addEventListener('change', async (e) => {
      await window.settingsAPI.updateCharacter(charId, { enabled: e.target.checked ? 1 : 0 });
      refreshData();
    });
  };
  setupCharToggle('dash-toggle-kage', 'kage');
  setupCharToggle('char-enable-kage', 'kage');
  setupCharToggle('dash-toggle-chan', 'kage-chan');
  setupCharToggle('char-enable-chan', 'kage-chan');

  // Scales
  const setupScaleSlider = (rangeId, labelId, charId) => {
    const range = document.getElementById(rangeId);
    range.addEventListener('input', async (e) => {
      const val = parseFloat(e.target.value);
      document.getElementById(labelId).textContent = `${Math.round(val * 100)}%`;
      await window.settingsAPI.updateCharacter(charId, { scale: val });
    });
  };
  setupScaleSlider('range-kage-scale', 'val-kage-scale', 'kage');
  setupScaleSlider('range-chan-scale', 'val-chan-scale', 'kage-chan');

  document.getElementById('btn-reset-scales').addEventListener('click', async () => {
    await window.settingsAPI.updateCharacter('kage', { scale: 1.0 });
    await window.settingsAPI.updateCharacter('kage-chan', { scale: 1.0 });
    refreshData();
  });

  // Appearance
  document.getElementById('app-enable-glow').addEventListener('change', async (e) => {
    await window.settingsAPI.saveSetting('theme_glow', e.target.checked ? 'true' : 'false');
  });

  document.getElementById('range-glow-intensity').addEventListener('input', async (e) => {
    const val = e.target.value;
    document.getElementById('val-glow-intensity').textContent = `${Math.round(val * 100)}%`;
    await window.settingsAPI.saveSetting('glow_intensity', val);
  });

  document.getElementById('select-bubble-style').addEventListener('change', async (e) => {
    await window.settingsAPI.saveSetting('bubble_style', e.target.value);
  });

  // Personality
  document.getElementById('range-mischief').addEventListener('input', async (e) => {
    await window.settingsAPI.updateCharacter('kage', { mischief: parseInt(e.target.value, 10) });
  });

  // Force Mood Expressions
  document.querySelectorAll('#kage-mood-btns button, #chan-mood-btns button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const char = btn.getAttribute('data-char');
      const mood = btn.getAttribute('data-mood');
      await window.settingsAPI.updateCharacter(char, { mood });
      if (window.soundSynth) window.soundSynth.play('click');
      refreshData();
    });
  });

  // Interaction Interval
  document.getElementById('range-interval').addEventListener('input', async (e) => {
    const val = e.target.value;
    document.getElementById('val-interval').textContent = `${val}s`;
    await window.settingsAPI.saveSetting('interaction_interval', val);
  });

  // Audio settings
  document.getElementById('audio-enable').addEventListener('change', async (e) => {
    await window.settingsAPI.saveSetting('sound_enabled', e.target.checked ? 'true' : 'false');
    if (window.soundSynth) window.soundSynth.setEnabled(e.target.checked);
  });

  document.getElementById('range-volume').addEventListener('input', async (e) => {
    const val = e.target.value;
    document.getElementById('val-volume').textContent = `${Math.round(val * 100)}%`;
    await window.settingsAPI.saveSetting('sound_volume', val);
    if (window.soundSynth) window.soundSynth.setVolume(val);
  });

  document.getElementById('range-pitch').addEventListener('input', async (e) => {
    const val = e.target.value;
    document.getElementById('val-pitch').textContent = `${val}x`;
    await window.settingsAPI.saveSetting('voice_pitch', val);
    if (window.soundSynth) window.soundSynth.setPitch(val);
  });

  // Audio test buttons
  document.getElementById('test-chirp').addEventListener('click', () => window.soundSynth && window.soundSynth.play('talk'));
  document.getElementById('test-pet').addEventListener('click', () => window.soundSynth && window.soundSynth.play('pet'));
  document.getElementById('test-play').addEventListener('click', () => window.soundSynth && window.soundSynth.play('play'));
  document.getElementById('test-question').addEventListener('click', () => window.soundSynth && window.soundSynth.play('question'));
  document.getElementById('test-sleep').addEventListener('click', () => window.soundSynth && window.soundSynth.play('sleep'));

  // Startup configuration
  document.getElementById('startup-toggle').addEventListener('change', async (e) => {
    await window.settingsAPI.setAutoLaunch(e.target.checked);
    document.getElementById('startup-status-text').textContent = e.target.checked ? 'Registered & Active' : 'Disabled';
  });

  // Privacy & Data
  document.getElementById('btn-open-folder').addEventListener('click', async () => {
    await window.settingsAPI.openUserDataFolder();
  });

  document.getElementById('btn-clear-history').addEventListener('click', async () => {
    if (confirm('Clear all interaction and memory history?')) {
      await window.settingsAPI.clearHistory();
      refreshData();
    }
  });

  // Quit
  document.getElementById('btn-quit').addEventListener('click', async () => {
    await window.settingsAPI.quitApp();
  });

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});

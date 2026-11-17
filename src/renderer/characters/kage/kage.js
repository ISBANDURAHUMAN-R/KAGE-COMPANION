/**
 * KAGE Companion Client Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('companion-wrapper');
  container.innerHTML = window.createKageSVG();

  const avatar = document.getElementById('kage-avatar');
  const balloon = document.getElementById('speech-balloon');
  const balloonText = document.getElementById('speech-text');
  const menu = document.getElementById('interaction-menu');
  const tooltip = document.getElementById('menu-tooltip');

  let currentState = 'idle';
  let speechTimer = null;
  let stateResetTimer = null;

  // Drag tracking
  let isMouseDown = false;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentScreenX = 0;
  let currentScreenY = 0;

  // Initial config load
  try {
    const config = await window.companionAPI.getConfig('kage');
    if (config) {
      if (config.character && config.character.mood) {
        setMood(config.character.mood);
      }
      if (config.character && config.character.scale) {
        applyScale(config.character.scale);
      }
      if (config.settings) {
        applySettings(config.settings);
      }
    }
  } catch (err) {
    console.error('Failed to load initial kage config:', err);
  }

  function applyScale(scale) {
    const s = Math.max(0.5, Math.min(2.0, parseFloat(scale) || 1.0));
    avatar.style.transform = `scale(${s})`;
  }

  function applySettings(settings) {
    if (window.soundSynth) {
      window.soundSynth.setEnabled(settings.sound_enabled === 'true');
      window.soundSynth.setVolume(parseFloat(settings.sound_volume) || 0.7);
      window.soundSynth.setPitch(parseFloat(settings.voice_pitch) || 1.0);
    }
  }

  function setMood(state, duration = null) {
    currentState = state;
    window.setKageState(state, container);

    if (stateResetTimer) clearTimeout(stateResetTimer);
    if (duration && duration > 0) {
      stateResetTimer = setTimeout(() => {
        window.setKageState('idle', container);
        currentState = 'idle';
      }, duration);
    }
  }

  function showSpeech(text, anim = 'talking', duration = 4500) {
    if (speechTimer) clearTimeout(speechTimer);

    if (anim) {
      setMood(anim, duration);
    }

    balloonText.textContent = '';
    balloon.classList.add('visible');

    // Synthesize audio chirp
    if (window.soundSynth) {
      window.soundSynth.play('talk');
    }

    // Typewriter effect
    let charIdx = 0;
    const typeInterval = setInterval(() => {
      if (charIdx < text.length) {
        balloonText.textContent += text.charAt(charIdx);
        charIdx++;
      } else {
        clearInterval(typeInterval);
      }
    }, 22);

    speechTimer = setTimeout(() => {
      balloon.classList.remove('visible');
      if (currentState === 'talking') {
        setMood('idle');
      }
    }, duration);
  }

  function toggleMenu(show) {
    if (show) {
      menu.classList.add('open');
      if (window.soundSynth) window.soundSynth.play('click');
    } else {
      menu.classList.remove('open');
      tooltip.textContent = '';
    }
  }

  // ------------------- DRAG & CLICK LOGIC -------------------

  avatar.addEventListener('mousedown', (e) => {
    // Only primary mouse button and not on menu items
    if (e.button !== 0 || e.target.closest('.menu-item')) return;

    isMouseDown = true;
    isDragging = false;
    startX = e.screenX;
    startY = e.screenY;
    currentScreenX = e.screenX;
    currentScreenY = e.screenY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;

    const dx = e.screenX - currentScreenX;
    const dy = e.screenY - currentScreenY;

    // Detect drag threshold
    const totalDist = Math.hypot(e.screenX - startX, e.screenY - startY);
    if (totalDist > 5) {
      isDragging = true;
      toggleMenu(false); // Close menu during drag
      currentScreenX = e.screenX;
      currentScreenY = e.screenY;
      window.companionAPI.moveWindow('kage', dx, dy);
    }
  });

  window.addEventListener('mouseup', async (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;

    if (!isDragging && e.button === 0 && !e.target.closest('.menu-item')) {
      // It was a click!
      if (menu.classList.contains('open')) {
        toggleMenu(false);
      } else {
        toggleMenu(true);
      }
    }
    isDragging = false;
  });

  // ------------------- MENU INTERACTIONS -------------------

  menu.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const tip = item.getAttribute('data-tooltip');
      if (tip) tooltip.textContent = tip;
    });

    item.addEventListener('mouseleave', () => {
      tooltip.textContent = '';
    });

    item.addEventListener('click', async (e) => {
      e.stopPropagation();
      const action = item.getAttribute('data-action');
      toggleMenu(false);

      if (action === 'close') return;

      if (action === 'settings') {
        window.companionAPI.openSettings('dashboard');
        return;
      }

      if (window.soundSynth) {
        window.soundSynth.play(action);
      }

      try {
        const result = await window.companionAPI.interact('kage', action);
        if (result) {
          showSpeech(result.text, result.anim, 4500);
        }
      } catch (err) {
        console.error('Interaction error:', err);
      }
    });
  });

  // ------------------- IPC LISTENERS -------------------

  window.companionAPI.on('companion:say', (data) => {
    if (data && data.text) {
      showSpeech(data.text, data.anim || 'talking', data.duration || 4500);
    }
  });

  window.companionAPI.on('companion:play-animation', (data) => {
    if (data && data.anim) {
      setMood(data.anim, data.duration || 3000);
    }
  });

  window.companionAPI.on('companion:update-config', (data) => {
    if (data) {
      if (data.scale !== undefined) applyScale(data.scale);
      if (data.key === 'sound_enabled' && window.soundSynth) {
        window.soundSynth.setEnabled(data.value === 'true');
      }
      if (data.key === 'sound_volume' && window.soundSynth) {
        window.soundSynth.setVolume(data.value);
      }
      if (data.key === 'voice_pitch' && window.soundSynth) {
        window.soundSynth.setPitch(data.value);
      }
    }
  });
});

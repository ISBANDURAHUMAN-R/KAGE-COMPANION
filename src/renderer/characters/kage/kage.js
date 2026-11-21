/**
 * KAGE Companion Client Logic — Transparent Desktop Companion
 * 100% Reliable Dragging & Instant Mood Changing • Zero Question Popups
 */

// Disable native image dragging completely
window.addEventListener('dragstart', (e) => e.preventDefault());

document.addEventListener('DOMContentLoaded', async () => {
  const mount = document.getElementById('avatar-mount') || document.getElementById('companion-wrapper');
  mount.innerHTML = window.createKageSVG();

  const avatar = document.getElementById('kage-avatar');
  const wrapper = document.getElementById('companion-wrapper');
  const menu = document.getElementById('interaction-menu');

  let currentState = 'idle';
  let stateResetTimer = null;

  // Ultra-reliable delta dragging state (immune to pointercancel, no pointer capture)
  let isMouseDown = false;
  let isDragging = false;
  let hasMoved = false;
  let startScreenX = 0;
  let startScreenY = 0;

  // Mood cycle list for automatic switching on click (all official expressions & actions)
  const moodCycle = [
    'happy',
    'excited',
    'blushing',
    'curious',
    'coffee',
    'gaming',
    'coding',
    'love',
    'angry',
    'demon',
    'sleepy',
    'sleeping',
    'sunglasses',
    'music',
    'idle'
  ];
  let moodIndex = 0;

  // Initial config load from SQLite
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
    const s = Math.max(0.6, Math.min(1.8, parseFloat(scale) || 1.0));
    if (avatar) avatar.style.transform = `scale(${s})`;
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
    window.setKageState(state);

    if (stateResetTimer) clearTimeout(stateResetTimer);
    if (duration && duration > 0) {
      stateResetTimer = setTimeout(() => {
        window.setKageState('idle');
        currentState = 'idle';
      }, duration);
    }
  }

  // Automatic mood reaction when user clicks on KAGE (NO POPPING QUESTIONS!)
  async function triggerClickMoodChange() {
    moodIndex = (moodIndex + 1) % moodCycle.length;
    const nextMood = moodCycle[moodIndex];

    // Immediately update sprite & emote on screen!
    setMood(nextMood);

    // Map mood to sound interaction
    const soundMap = {
      happy: 'pet',
      excited: 'play',
      blushing: 'pet',
      curious: 'talk',
      teasing: 'talk',
      coffee: 'talk',
      gaming: 'play',
      coding: 'talk',
      love: 'pet',
      angry: 'talk',
      demon: 'talk',
      sleepy: 'sleep',
      sleeping: 'sleep',
      sunglasses: 'play',
      music: 'play',
      idle: 'talk'
    };

    const action = soundMap[nextMood] || 'pet';
    if (window.soundSynth) {
      window.soundSynth.play(action);
    }

    // Persist interaction silently to SQLite without showing question speech balloon
    try {
      await window.companionAPI.interact('kage', action);
    } catch (err) {}
  }

  // ------------------- ULTRA-SMOOTH DRAGGING & INSTANT CLICK -------------------

  // Drag on avatar or companion wrapper
  const dragTarget = avatar || wrapper;

  dragTarget.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only primary button
    if (e.target && e.target.closest && e.target.closest('.menu-item')) return;

    isMouseDown = true;
    isDragging = false;
    hasMoved = false;
    startScreenX = e.screenX;
    startScreenY = e.screenY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;

    // Safety: check if mouse button was released outside
    if (e.buttons === 0) {
      isMouseDown = false;
      isDragging = false;
      return;
    }

    const dx = e.screenX - startScreenX;
    const dy = e.screenY - startScreenY;

    if (!isDragging && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
      isDragging = true;
      hasMoved = true;
      if (menu) menu.classList.remove('open');
    }

    if (isDragging) {
      window.companionAPI.moveByFast('kage', dx, dy);
      startScreenX = e.screenX;
      startScreenY = e.screenY;
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;

    if (isDragging) {
      isDragging = false;
      // Persist window position to SQLite
      window.companionAPI.savePosition('kage', e.screenX, e.screenY);
    } else if (!hasMoved && e.button === 0) {
      // Clean click detected -> Instant Mood Change without question balloons!
      if (!e.target.closest || !e.target.closest('.menu-item')) {
        triggerClickMoodChange();
      }
    }
  });

  // Right-click opens Settings
  dragTarget.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    window.companionAPI.openSettings('characters');
  });

  // ------------------- MENU INTERACTIONS (RADIAL MENU) -------------------

  if (menu) {
    menu.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        e.stopPropagation();
        const action = item.getAttribute('data-action');
        menu.classList.remove('open');

        if (action === 'close') return;
        if (action === 'settings') {
          window.companionAPI.openSettings('characters');
          return;
        }

        if (window.soundSynth) window.soundSynth.play(action);
        try {
          const result = await window.companionAPI.interact('kage', action);
          if (result && result.anim) {
            setMood(result.anim, 3500);
          }
        } catch (err) {}
      });
    });
  }

  // ------------------- IPC LISTENERS -------------------

  window.companionAPI.on('companion:play-animation', (data) => {
    if (data && data.anim) {
      setMood(data.anim, data.duration || 3000);
    }
  });

  window.companionAPI.on('companion:set-mood', (data) => {
    if (data && data.mood) {
      setMood(data.mood);
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

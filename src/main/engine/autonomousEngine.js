const db = require('../database/db');
const personalityEngine = require('./personalityEngine');

class AutonomousEngine {
  constructor() {
    this.intervalId = null;
    this.windowManager = null;
  }

  start(windowManager) {
    this.windowManager = windowManager;
    personalityEngine.init();

    this.restartTimer();
  }

  restartTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    const intervalSec = parseInt(db.getSetting('interaction_interval', '45'), 10) || 45;
    this.intervalId = setInterval(() => {
      this.tick();
    }, intervalSec * 1000);
  }

  tick() {
    if (!this.windowManager) return;

    // Zero cross chatter, zero talking: companions are silent pets/chibis
    const mode = db.getSetting('desktop_mode', 'quiet');
    if (mode === 'quiet') return;

    const targets = ['kage', 'kage-chan'].filter(id => {
      const char = db.getCharacter(id);
      return char && char.enabled;
    });

    if (targets.length === 0) return;

    // Pick one character for a subtle, silent idle micro-motion (visual only, NO SPEECH, NO CHATTER)
    const charId = targets[Math.floor(Math.random() * targets.length)];
    this.triggerSilentMicroMotion(charId);
  }

  triggerSilentMicroMotion(charId) {
    const silentAnims = ['idle', 'sitting', 'sleepy', 'curious'];
    const chosenAnim = silentAnims[Math.floor(Math.random() * silentAnims.length)];
    
    this.windowManager.sendToCompanion(charId, 'companion:play-animation', {
      anim: chosenAnim,
      duration: 3500
    });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    personalityEngine.destroy();
  }
}

module.exports = new AutonomousEngine();

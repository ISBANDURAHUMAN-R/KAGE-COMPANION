const db = require('../database/db');
const personalityEngine = require('./personalityEngine');
const relationshipEngine = require('./relationshipEngine');

class AutonomousEngine {
  constructor() {
    this.intervalId = null;
    this.windowManager = null;
    this.lastAction = {
      kage: 0,
      'kage-chan': 0
    };
  }

  start(windowManager) {
    this.windowManager = windowManager;
    personalityEngine.init();

    this.restartTimer();
  }

  restartTimer() {
    if (this.intervalId) clearInterval(this.intervalId);

    const intervalSec = parseInt(db.getSetting('interaction_interval', '30'), 10) || 30;
    this.intervalId = setInterval(() => {
      this.tick();
    }, intervalSec * 1000);
  }

  tick() {
    if (!this.windowManager) return;

    const mode = db.getSetting('desktop_mode', 'normal');
    if (mode === 'quiet') return;

    // Check if a cross-character interaction should occur
    const crossChance = mode === 'active' ? 0.45 : 0.25;
    if (Math.random() < crossChance && relationshipEngine.canPerformCrossInteraction()) {
      const scene = relationshipEngine.getNextCrossInteraction();
      if (scene) {
        this.executeCrossInteraction(scene);
        return;
      }
    }

    // Otherwise, autonomous micro-interaction or dialogue for one character
    const targets = ['kage', 'kage-chan'].filter(id => {
      const char = db.getCharacter(id);
      return char && char.enabled;
    });

    if (targets.length === 0) return;

    // Pick one character
    const charId = targets[Math.floor(Math.random() * targets.length)];
    const roll = Math.random();

    // 55% chance of visual-only micro animation (sit, curious, walk, stretch, yawns)
    // 45% chance of speech bubble dialogue
    if (roll < 0.55) {
      this.triggerMicroAnimation(charId);
    } else {
      this.triggerAutonomousDialogue(charId);
    }
  }

  triggerMicroAnimation(charId) {
    const microAnims = ['curious', 'sitting', 'sleepy', 'happy', 'walking', 'idle'];
    const chosenAnim = microAnims[Math.floor(Math.random() * microAnims.length)];
    
    this.windowManager.sendToCompanion(charId, 'companion:play-animation', {
      anim: chosenAnim,
      duration: 3500
    });
  }

  triggerAutonomousDialogue(charId) {
    const dialogue = personalityEngine.getAutonomousDialogue(charId);
    if (!dialogue) return;

    this.windowManager.sendToCompanion(charId, 'companion:say', {
      text: dialogue.text,
      anim: dialogue.anim,
      mood: dialogue.mood,
      duration: 5000
    });
  }

  executeCrossInteraction(scene) {
    // Initiator speaks first
    this.windowManager.sendToCompanion(scene.initiator, 'companion:say', {
      text: scene.first.text,
      anim: scene.first.anim,
      mood: scene.first.mood,
      duration: 4500
    });

    // Recipient responds after delay
    setTimeout(() => {
      this.windowManager.sendToCompanion(scene.recipient, 'companion:say', {
        text: scene.reply.text,
        anim: scene.reply.anim,
        mood: scene.reply.mood,
        duration: 4500
      });
    }, scene.delay);
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

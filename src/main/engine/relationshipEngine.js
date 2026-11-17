const db = require('../database/db');
const { CROSS_DIALOGUES } = require('./dialogueDatabase');

class RelationshipEngine {
  constructor() {
    this.lastCrossInteraction = 0;
  }

  canPerformCrossInteraction() {
    const kage = db.getCharacter('kage');
    const kageChan = db.getCharacter('kage-chan');

    if (!kage || !kage.enabled || !kageChan || !kageChan.enabled) {
      return false;
    }

    const desktopMode = db.getSetting('desktop_mode', 'normal');
    if (desktopMode === 'quiet' || desktopMode === 'focus') {
      return false;
    }

    // Minimum 2 minutes between cross interactions
    const minCooldown = desktopMode === 'active' ? 90000 : 180000;
    if (Date.now() - this.lastCrossInteraction < minCooldown) {
      return false;
    }

    return true;
  }

  getNextCrossInteraction() {
    if (!this.canPerformCrossInteraction()) {
      return null;
    }

    this.lastCrossInteraction = Date.now();
    const index = Math.floor(Math.random() * CROSS_DIALOGUES.length);
    const scene = CROSS_DIALOGUES[index];

    return {
      initiator: scene.initiator,
      recipient: scene.recipient,
      first: scene.first,
      reply: scene.reply,
      delay: scene.delay || 2500
    };
  }
}

module.exports = new RelationshipEngine();

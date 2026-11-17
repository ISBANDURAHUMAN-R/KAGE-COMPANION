const db = require('../database/db');
const { KAGE_DIALOGUES, KAGE_CHAN_DIALOGUES } = require('./dialogueDatabase');

class PersonalityEngine {
  constructor() {
    this.decayTimer = null;
  }

  init() {
    // Start periodic background mood shift / energy consumption
    if (this.decayTimer) clearInterval(this.decayTimer);
    this.decayTimer = setInterval(() => {
      this.naturalMoodDecay();
    }, 60000); // every minute
  }

  getTimeContext() {
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 5) return 'late_night';
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  }

  getDialoguesForCharacter(characterId) {
    return characterId === 'kage' ? KAGE_DIALOGUES : KAGE_CHAN_DIALOGUES;
  }

  // Handle direct user interaction
  handleInteraction(characterId, interactionType) {
    const char = db.getCharacter(characterId);
    if (!char) return null;

    const dialogues = this.getDialoguesForCharacter(characterId);
    const interactionSet = dialogues.interactions[interactionType] || dialogues.interactions.talk;

    // Filter out dialogue items on cooldown
    const cooldownMs = 90000;
    const available = interactionSet.filter(d => !db.isDialogueOnCooldown(characterId, d.key, cooldownMs));
    const chosen = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : interactionSet[Math.floor(Math.random() * interactionSet.length)];

    // Record dialogue
    db.recordDialogue(characterId, chosen.key);

    const oldMood = char.mood;
    let newMood = chosen.mood || 'idle';
    let newAffection = char.affection;
    let newEnergy = char.energy;
    let newMischief = char.mischief;

    switch (interactionType) {
      case 'pet':
        newAffection = Math.min(100, newAffection + 5);
        newMood = 'happy';
        break;
      case 'play':
        newEnergy = Math.max(0, newEnergy - 8);
        newAffection = Math.min(100, newAffection + 3);
        newMischief = characterId === 'kage' ? Math.min(100, newMischief + 5) : newMischief;
        newMood = 'excited';
        break;
      case 'talk':
        newAffection = Math.min(100, newAffection + 2);
        newMood = chosen.mood || 'talking';
        break;
      case 'sleep':
        newMood = 'sleeping';
        newEnergy = Math.min(100, newEnergy + 20);
        break;
      case 'dismiss':
        newMood = 'idle';
        break;
      case 'question':
        newMood = 'curious';
        break;
    }

    db.updateCharacter(characterId, {
      mood: newMood,
      affection: newAffection,
      energy: newEnergy,
      mischief: newMischief,
      last_interaction: Date.now()
    });

    db.logInteraction(characterId, interactionType, oldMood, newMood, chosen.text);

    return {
      text: chosen.text,
      mood: newMood,
      anim: chosen.anim || newMood,
      affection: newAffection,
      energy: newEnergy
    };
  }

  // Choose autonomous idle dialogue
  getAutonomousDialogue(characterId) {
    const char = db.getCharacter(characterId);
    if (!char || !char.enabled) return null;

    const desktopMode = db.getSetting('desktop_mode', 'normal');
    if (desktopMode === 'quiet') return null;

    // In focus mode, lower chatter and only supportive
    if (desktopMode === 'focus' && Math.random() > 0.3) {
      return null;
    }

    const dialogues = this.getDialoguesForCharacter(characterId);
    const timeCtx = this.getTimeContext();

    // Pool candidate categories
    let pool = [...dialogues.idle];
    if (timeCtx === 'late_night' && dialogues.late_night) {
      pool.push(...dialogues.late_night);
    } else if (timeCtx === 'morning' && dialogues.morning) {
      pool.push(...dialogues.morning);
    }

    // Include mood-specific pools
    if (dialogues[char.mood] && Array.isArray(dialogues[char.mood])) {
      pool.push(...dialogues[char.mood]);
    }

    // Cooldown check
    const cooldownMs = 180000;
    const available = pool.filter(d => !db.isDialogueOnCooldown(characterId, d.key, cooldownMs));
    if (available.length === 0) return null;

    const chosen = available[Math.floor(Math.random() * available.length)];
    db.recordDialogue(characterId, chosen.key);

    db.updateCharacter(characterId, {
      mood: chosen.mood,
      last_interaction: Date.now()
    });

    return {
      text: chosen.text,
      mood: chosen.mood,
      anim: chosen.anim || chosen.mood
    };
  }

  naturalMoodDecay() {
    const characters = db.getAllCharacters();
    for (const char of characters) {
      let energy = char.energy;
      let mood = char.mood;

      // Slowly regain or drop energy
      if (mood === 'sleeping') {
        energy = Math.min(100, energy + 5);
        if (energy >= 95) {
          mood = 'idle'; // wake up when rested
        }
      } else {
        energy = Math.max(0, energy - 1);
        if (energy < 15 && mood !== 'sleepy' && mood !== 'sleeping') {
          mood = 'sleepy';
        }
      }

      db.updateCharacter(char.id, { energy, mood });
    }
  }

  destroy() {
    if (this.decayTimer) {
      clearInterval(this.decayTimer);
      this.decayTimer = null;
    }
  }
}

module.exports = new PersonalityEngine();

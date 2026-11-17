/**
 * VOIDKAGE Web Audio Synthesizer
 * Generates custom synthesized SFX in real time with zero external audio files.
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.7;
    this.pitch = 1.0;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, parseFloat(vol)));
  }

  setEnabled(val) {
    this.enabled = Boolean(val);
  }

  setPitch(pitch) {
    this.pitch = Math.max(0.5, Math.min(2.0, parseFloat(pitch)));
  }

  play(soundType) {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      switch (soundType) {
        case 'chirp':
        case 'talk':
          this.synthesizeChirp(ctx);
          break;
        case 'pet':
          this.synthesizePet(ctx);
          break;
        case 'play':
        case 'excited':
          this.synthesizePlay(ctx);
          break;
        case 'question':
        case 'curious':
          this.synthesizeQuestion(ctx);
          break;
        case 'sleep':
        case 'sleepy':
          this.synthesizeSleep(ctx);
          break;
        case 'angry':
          this.synthesizeAngry(ctx);
          break;
        case 'click':
          this.synthesizeClick(ctx);
          break;
        case 'notify':
        default:
          this.synthesizeNotify(ctx);
          break;
      }
    } catch (err) {
      console.warn('Audio synthesis error:', err);
    }
  }

  synthesizeChirp(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    const baseFreq = (650 + Math.random() * 150) * this.pitch;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  synthesizePet(ctx) {
    // Warm, gentle double chime
    const now = ctx.currentTime;
    [0, 0.09].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + delay;
      const freq = (idx === 0 ? 523.25 : 659.25) * this.pitch; // C5 to E5

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.23);
    });
  }

  synthesizePlay(ctx) {
    // Bouncy arcade chime
    const now = ctx.currentTime;
    const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * this.pitch, startTime);

      gain.gain.setValueAtTime(this.volume * 0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.13);
    });
  }

  synthesizeQuestion(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420 * this.pitch, now);
    osc.frequency.exponentialRampToValueAtTime(740 * this.pitch, now + 0.16);

    gain.gain.setValueAtTime(this.volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  synthesizeSleep(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320 * this.pitch, now);
    osc.frequency.exponentialRampToValueAtTime(200 * this.pitch, now + 0.4);

    gain.gain.setValueAtTime(this.volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  }

  synthesizeAngry(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160 * this.pitch, now);
    osc.frequency.linearRampToValueAtTime(110 * this.pitch, now + 0.18);

    gain.gain.setValueAtTime(this.volume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  synthesizeClick(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 * this.pitch, now);

    gain.gain.setValueAtTime(this.volume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  synthesizeNotify(ctx) {
    const now = ctx.currentTime;
    [587.33, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * this.pitch, startTime);

      gain.gain.setValueAtTime(this.volume * 0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.26);
    });
  }
}

// Global instance in renderer
window.soundSynth = new SoundSynthesizer();

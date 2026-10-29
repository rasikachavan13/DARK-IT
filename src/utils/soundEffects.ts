/**
 * Web Audio API Sound Engine for DARKIT — The Haunted Git Terminal
 * Provides eerie ambient background soundscapes and mechanical/ghostly interaction sounds.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: Array<AudioNode> = [];
  private isAmbiencePlaying = false;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Starts or stops the subtle haunted background ambience (wind + low ethereal drone)
   */
  public setAmbience(enabled: boolean) {
    const ctx = this.initContext();
    if (!ctx) return;

    if (enabled && !this.isAmbiencePlaying) {
      this.startAmbience(ctx);
    } else if (!enabled && this.isAmbiencePlaying) {
      this.stopAmbience();
    }
  }

  private startAmbience(ctx: AudioContext) {
    try {
      this.stopAmbience();

      const masterAmbienceGain = ctx.createGain();
      // Keep ambience very gentle and quiet
      masterAmbienceGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterAmbienceGain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 2.5);
      masterAmbienceGain.connect(ctx.destination);
      this.ambientGain = masterAmbienceGain;

      // 1. Low drone oscillator (haunted crypt hum)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2

      // Gentle detuning for eerie beating
      osc2.detune.setValueAtTime(4, ctx.currentTime);

      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(180, ctx.currentTime);

      osc1.connect(droneFilter);
      osc2.connect(droneFilter);
      droneFilter.connect(masterAmbienceGain);

      osc1.start();
      osc2.start();
      this.ambientNodes.push(osc1, osc2, droneFilter);

      // 2. Slow subtle spectral wind filter
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(320, ctx.currentTime);
      bandpass.Q.setValueAtTime(3.5, ctx.currentTime);

      // LFO to slowly sweep the wind frequency
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.015, ctx.currentTime);

      whiteNoise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(masterAmbienceGain);

      whiteNoise.start();
      lfo.start();
      this.ambientNodes.push(whiteNoise, lfo, bandpass, noiseGain, lfoGain);

      this.isAmbiencePlaying = true;
    } catch (err) {
      console.warn('Audio ambience initiation error:', err);
    }
  }

  private stopAmbience() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.ctx.currentTime);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.ambientNodes.forEach((node) => {
            try {
              (node as any).stop?.();
              node.disconnect();
            } catch (e) {}
          });
          this.ambientNodes = [];
          this.ambientGain = null;
        }, 850);
      } catch (e) {
        this.ambientNodes = [];
        this.ambientGain = null;
      }
    }
    this.isAmbiencePlaying = false;
  }

  /**
   * Mechanical spooky terminal key/button click
   */
  public playClick() {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }

  /**
   * Ethereal ghost chime when asking questions or when spirits respond
   */
  public playGhostChime() {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const freqs = [659.25, 783.99, 987.77]; // E5, G5, B5 (mysterious minor triad)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.5);
      });
    } catch (e) {}
  }

  /**
   * Supernatural summon ritual sound
   */
  public playSummon() {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.5);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {}
  }

  /**
   * Banishing whoosh & bell when a bug is exorcised
   */
  public playExorcise() {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      // 1. Purifying chime
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
      bellGain.gain.setValueAtTime(0.09, ctx.currentTime);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      bell.connect(bellGain);
      bellGain.connect(ctx.destination);
      bell.start();
      bell.stop(ctx.currentTime + 0.65);

      // 2. Dissolving sweep
      const sweep = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweep.type = 'triangle';
      sweep.frequency.setValueAtTime(800, ctx.currentTime);
      sweep.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);

      sweepGain.gain.setValueAtTime(0.05, ctx.currentTime);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      sweep.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweep.start();
      sweep.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  }

  /**
   * Triumphant level-up / reward chime
   */
  public playReward() {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((note, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
      });
    } catch (e) {}
  }
}

export const soundEngine = new SoundEngine();

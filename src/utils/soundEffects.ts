/**
 * Web Audio API Sound Engine for DARKIT — The Haunted Git Terminal
 * Provides continuous eerie ghost danger soundscapes and mechanical/ghostly interaction sounds.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private dangerMasterGain: GainNode | null = null;
  private dangerNodes: Array<AudioNode> = [];
  private isDangerPlaying = false;
  private isMuted = false;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Resumes the AudioContext on first user interaction to comply with browser autoplay policies
   */
  public resumeOnInteraction() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        if (!this.isMuted && !this.isDangerPlaying) {
          this.startDangerAmbience();
        }
      }).catch(() => {});
    }
  }

  /**
   * Starts or stops the continuous ghost danger sound playing in the background
   */
  public setAmbience(enabled: boolean) {
    this.isMuted = !enabled;
    const ctx = this.initContext();
    if (!ctx) return;

    if (enabled && !this.isDangerPlaying) {
      this.startDangerAmbience();
    } else if (!enabled && this.isDangerPlaying) {
      this.stopDangerAmbience();
    }
  }

  /**
   * Continuous Ghost Danger Soundscape:
   * 1. Sub-bass pulsating dread drone (binaural detuned tension)
   * 2. Menacing ghost heartbeat / swell LFO
   * 3. Discordant spectral tritone harmonics (evil minor resonance)
   * 4. Ghostly howling wind with dynamic bandpass filter
   * 5. Eerie high-frequency ghost shiver resonance
   */
  public startDangerAmbience() {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      this.stopDangerAmbience();

      const master = ctx.createGain();
      // Gentle master level for non-intrusive yet distinct continuous ghost danger ambience
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.065, ctx.currentTime + 2.0);
      master.connect(ctx.destination);
      this.dangerMasterGain = master;

      const nodes: AudioNode[] = [];

      // 1. Deep Sub-bass Danger Drone (Dread Rumble at ~44Hz & ~46.5Hz for 2.5Hz binaural beating)
      const sub1 = ctx.createOscillator();
      const sub2 = ctx.createOscillator();
      sub1.type = 'sine';
      sub2.type = 'sine';
      sub1.frequency.setValueAtTime(43.65, ctx.currentTime); // F1
      sub2.frequency.setValueAtTime(46.25, ctx.currentTime); // F#1 (menacing minor-second dissonance)

      const subFilter = ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(140, ctx.currentTime);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.35, ctx.currentTime);

      sub1.connect(subFilter);
      sub2.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(master);

      sub1.start();
      sub2.start();
      nodes.push(sub1, sub2, subFilter, subGain);

      // 2. Ghostly Tritone Harmonics (Eerie discordance: D3 ~ 146.8Hz + G#3 ~ 207.65Hz)
      const tritone1 = ctx.createOscillator();
      const tritone2 = ctx.createOscillator();
      tritone1.type = 'triangle';
      tritone2.type = 'sawtooth';
      tritone1.frequency.setValueAtTime(146.83, ctx.currentTime);
      tritone2.frequency.setValueAtTime(207.65, ctx.currentTime);

      // Modulate tritone detuning slightly for ghostly haunting drift
      const tritoneLfo = ctx.createOscillator();
      tritoneLfo.frequency.setValueAtTime(0.18, ctx.currentTime);
      const tritoneLfoGain = ctx.createGain();
      tritoneLfoGain.gain.setValueAtTime(8, ctx.currentTime);
      tritoneLfo.connect(tritoneLfoGain);
      tritoneLfoGain.connect(tritone2.detune);
      tritoneLfo.start();

      const tritoneFilter = ctx.createBiquadFilter();
      tritoneFilter.type = 'bandpass';
      tritoneFilter.frequency.setValueAtTime(220, ctx.currentTime);
      tritoneFilter.Q.setValueAtTime(4.0, ctx.currentTime);

      const tritoneGain = ctx.createGain();
      tritoneGain.gain.setValueAtTime(0.04, ctx.currentTime);

      tritone1.connect(tritoneFilter);
      tritone2.connect(tritoneFilter);
      tritoneFilter.connect(tritoneGain);
      tritoneGain.connect(master);

      tritone1.start();
      tritone2.start();
      nodes.push(tritone1, tritone2, tritoneLfo, tritoneLfoGain, tritoneFilter, tritoneGain);

      // 3. Menacing Danger Swell / Ghost Heartbeat LFO
      const pulseOsc = ctx.createOscillator();
      pulseOsc.type = 'sine';
      pulseOsc.frequency.setValueAtTime(0.32, ctx.currentTime); // ~3.1s cycle
      const pulseGain = ctx.createGain();
      pulseGain.gain.setValueAtTime(0.015, ctx.currentTime);
      pulseOsc.connect(pulseGain);
      pulseGain.connect(master.gain);
      pulseOsc.start();
      nodes.push(pulseOsc, pulseGain);

      // 4. Ghostly Spectral Wind & Whispering Noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise approximation for darker, warmer howling wind
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.3;
      }

      const spectralNoise = ctx.createBufferSource();
      spectralNoise.buffer = noiseBuffer;
      spectralNoise.loop = true;

      const windBandpass = ctx.createBiquadFilter();
      windBandpass.type = 'bandpass';
      windBandpass.frequency.setValueAtTime(380, ctx.currentTime);
      windBandpass.Q.setValueAtTime(5.5, ctx.currentTime);

      // Slow wind modulation
      const windLfo = ctx.createOscillator();
      windLfo.frequency.setValueAtTime(0.09, ctx.currentTime);
      const windLfoGain = ctx.createGain();
      windLfoGain.gain.setValueAtTime(220, ctx.currentTime);
      windLfo.connect(windLfoGain);
      windLfoGain.connect(windBandpass.frequency);
      windLfo.start();

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.045, ctx.currentTime);

      spectralNoise.connect(windBandpass);
      windBandpass.connect(windGain);
      windGain.connect(master);
      spectralNoise.start();

      nodes.push(spectralNoise, windLfo, windLfoGain, windBandpass, windGain);

      // 5. Spooky Danger Shimmer (Ethereal high overtone at 932Hz with trembling vibrato)
      const shimmer = ctx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(932.33, ctx.currentTime); // Bb5

      const shimmerVibrato = ctx.createOscillator();
      shimmerVibrato.frequency.setValueAtTime(4.5, ctx.currentTime);
      const shimmerVibratoGain = ctx.createGain();
      shimmerVibratoGain.gain.setValueAtTime(6.0, ctx.currentTime);
      shimmerVibrato.connect(shimmerVibratoGain);
      shimmerVibratoGain.connect(shimmer.frequency);
      shimmerVibrato.start();

      const shimmerFilter = ctx.createBiquadFilter();
      shimmerFilter.type = 'bandpass';
      shimmerFilter.frequency.setValueAtTime(950, ctx.currentTime);
      shimmerFilter.Q.setValueAtTime(6.0, ctx.currentTime);

      const shimmerGain = ctx.createGain();
      shimmerGain.gain.setValueAtTime(0.008, ctx.currentTime);

      shimmer.connect(shimmerFilter);
      shimmerFilter.connect(shimmerGain);
      shimmerGain.connect(master);
      shimmer.start();

      nodes.push(shimmer, shimmerVibrato, shimmerVibratoGain, shimmerFilter, shimmerGain);

      this.dangerNodes = nodes;
      this.isDangerPlaying = true;
    } catch (err) {
      console.warn('Continuous ghost danger audio notice:', err);
    }
  }

  private stopDangerAmbience() {
    if (this.dangerMasterGain && this.ctx) {
      try {
        this.dangerMasterGain.gain.setValueAtTime(
          this.dangerMasterGain.gain.value,
          this.ctx.currentTime
        );
        this.dangerMasterGain.gain.exponentialRampToValueAtTime(
          0.0001,
          this.ctx.currentTime + 0.6
        );
        setTimeout(() => {
          this.dangerNodes.forEach((node) => {
            try {
              (node as any).stop?.();
              node.disconnect();
            } catch (e) {}
          });
          this.dangerNodes = [];
          this.dangerMasterGain = null;
        }, 650);
      } catch (e) {
        this.dangerNodes = [];
        this.dangerMasterGain = null;
      }
    }
    this.isDangerPlaying = false;
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

  /**
   * Echo capture chime
   */
  public playEchoCatch() {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1108.73, ctx.currentTime + 0.15); // C#6

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  }
}

export const soundEngine = new SoundEngine();

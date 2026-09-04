// Web Audio API Holographic Sound & Ambient Synthesizer Engine

class HolographicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientActive: boolean = false;
  private musicListeners: Set<(state: { isPlaying: boolean; track: string; progress: number }) => void> = new Set();
  private musicPlaying: boolean = false;
  private currentTrack: string = 'Lofi Study';
  private progress: number = 0;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.isMuted = !enabled;
    if (!enabled && this.isAmbientActive) {
      this.stopAmbientHum();
    }
  }

  public setMuted(muted: boolean) {
    this.setEnabled(!muted);
  }

  public isSoundEnabled() {
    return !this.isMuted;
  }

  // 1. Holographic Phone Unlock Briefing Chime
  public playUnlock() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Chord frequencies: E5, B5, E6 (Futuristic crystal major harmonic)
      const freqs = [659.25, 987.77, 1318.51, 1975.53];
      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(f * 1.02, t + idx * 0.04 + 0.35);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(f * 1.5, t);
        filter.Q.setValueAtTime(4, t);

        gain.gain.setValueAtTime(0.0001, t + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), t + idx * 0.04 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.04 + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.5);
      });
    } catch {
      // Audio fallback
    }
  }

  // 2. Orbital Wheel Tick when spinning or snapping items
  public playOrbitalTick(pitch = 1200) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, t);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, t + 0.025);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.03);
    } catch {}
  }

  // 3. Holographic Bloom Expansion
  public playBloomOpen() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, t);
      filter.frequency.exponentialRampToValueAtTime(3200, t + 0.22);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.36);
    } catch {}
  }

  // 4. Bloom Close / Collapse
  public playBloomClose() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.18);

      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.21);
    } catch {}
  }

  // 5. Dismiss Briefing Swipe-Up Transition
  public playDismissBriefing() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const freqs = [329.63, 493.88, 659.25];
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + i * 0.03);
        osc.frequency.exponentialRampToValueAtTime(f * 1.5, t + i * 0.03 + 0.2);

        gain.gain.setValueAtTime(0.05, t + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.03 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + i * 0.03);
        osc.stop(t + i * 0.03 + 0.25);
      });
    } catch {}
  }

  // 6. Action Execution / Checkmark / Send
  public playActionExecute() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, t); // C5
      osc1.frequency.setValueAtTime(659.25, t + 0.07); // E5
      osc1.frequency.setValueAtTime(783.99, t + 0.14); // G5
      osc1.frequency.setValueAtTime(1046.5, t + 0.21); // C6

      osc2.frequency.setValueAtTime(1046.5, t + 0.21);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t + 0.21);
      osc1.stop(t + 0.46);
      osc2.stop(t + 0.46);
    } catch {}
  }

  // 7. Category Switch Pop
  public playCategorySwitch() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.04);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {}
  }

  // 8. Lock Screen / Power Down
  public playLockSound() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.15);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    } catch {}
  }

  // 9. Ambient Holographic Hum for DUHBLE audio synthesizer tool
  public toggleAmbientHum(enable: boolean) {
    if (this.isMuted || !enable) {
      this.stopAmbientHum();
      return;
    }
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.isAmbientActive) return;

      const t = this.ctx.currentTime;
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(108, t); // 108Hz meditative base

      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(112, t); // 4Hz binaural beat delta

      this.ambientGain.gain.setValueAtTime(0.001, t);
      this.ambientGain.gain.linearRampToValueAtTime(0.035, t + 1.2);

      this.ambientOsc1.connect(this.ambientGain);
      this.ambientOsc2.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isAmbientActive = true;
    } catch {}
  }

  private stopAmbientHum() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        try {
          this.ambientOsc1?.stop();
          this.ambientOsc2?.stop();
          this.ambientOsc1?.disconnect();
          this.ambientOsc2?.disconnect();
        } catch {}
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.isAmbientActive = false;
      }, 550);
    } catch {
      this.isAmbientActive = false;
    }
  }

  public playClick(freq = 800, type: OscillatorType = 'sine', duration = 0.04) {
    this.playOrbitalTick(freq);
  }

  public playAppOpen() {
    this.playBloomOpen();
  }

  public playShutter() {
    this.playActionExecute();
  }

  public playTone(freq = 440, type?: any, duration?: number) {
    this.playOrbitalTick(freq);
  }

  public playDtmf(digit: string) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Standard DTMF Dual Frequencies
      const dtmfMap: Record<string, [number, number]> = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477],
      };

      const [f1, f2] = dtmfMap[digit] || [800, 1200];

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(f1, t);
      osc2.frequency.setValueAtTime(f2, t);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.13);
      osc2.stop(t + 0.13);
    } catch {}
  }

  // Radar Ping for Mark GPS satellite constellation
  public playRadarPing() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.25);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.32);
    } catch {}
  }

  // Firewall packet drop / threat alert sound
  public playFirewallAlert() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.setValueAtTime(180, t + 0.08);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.22);
    } catch {}
  }

  // Cybernetic Synth Pulse
  public playCyberPulse() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(3200, t + 0.06);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch {}
  }

  public getMusicState() {
    return {
      isPlaying: this.musicPlaying,
      track: this.currentTrack,
      progress: this.progress,
    };
  }

  public subscribe(fn: (state: { isPlaying: boolean; track: string; progress: number }) => void) {
    this.musicListeners.add(fn);
    return () => this.musicListeners.delete(fn);
  }

  public toggleMusic(track?: string) {
    if (track) this.currentTrack = track;
    this.musicPlaying = !this.musicPlaying;
    this.toggleAmbientHum(this.musicPlaying);
    this.musicListeners.forEach((fn) => fn(this.getMusicState()));
  }

  public startMusic(track?: string) {
    if (track) this.currentTrack = track;
    this.musicPlaying = true;
    this.toggleAmbientHum(true);
    this.musicListeners.forEach((fn) => fn(this.getMusicState()));
  }
}

export const audioEngine = new HolographicAudioEngine();

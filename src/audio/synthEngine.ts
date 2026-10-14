/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Web Audio percussion synthesizer and custom audio sample playback engine.
 */

export interface SoundParams {
  velocity: number; // 0 - 127
  tune: number; // Semitones (-12 to +12)
  decay: number; // 0.1 to 3.0
  tone: number; // 0.0 to 1.0 (filter brightness)
  pan: number; // -1.0 to 1.0
  volume: number; // 0.0 to 1.0
  reverse?: boolean;
}

export class PercussionSynthesizer {
  constructor(private ctx: AudioContext) {}

  public playSound(
    soundType: string,
    destination: AudioNode,
    time: number,
    params: SoundParams,
    sampleBuffer?: AudioBuffer,
    trackName?: string,
    _trackCategory?: string
  ): void {
    const effectiveTime = Math.max(this.ctx.currentTime, time);

    // 1. If an AudioBuffer is provided (custom recorded or imported sample), play it through effects chain
    if (sampleBuffer) {
      this.playSampleBuffer(sampleBuffer, destination, effectiveTime, params);
      return;
    }

    // 2. Otherwise synthesize percussion procedurally based on soundType and track name
    this.synthesizeDrum(soundType, destination, effectiveTime, params, trackName);
  }

  private playSampleBuffer(
    buffer: AudioBuffer,
    destination: AudioNode,
    time: number,
    params: SoundParams
  ): void {
    let playBuffer = buffer;

    // Handle reverse if requested
    if (params.reverse) {
      try {
        const revBuf = this.ctx.createBuffer(
          buffer.numberOfChannels,
          buffer.length,
          buffer.sampleRate
        );
        for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
          const srcData = buffer.getChannelData(ch);
          const dstData = revBuf.getChannelData(ch);
          for (let i = 0, j = buffer.length - 1; i < buffer.length; i++, j--) {
            dstData[i] = srcData[j];
          }
        }
        playBuffer = revBuf;
      } catch (e) {
        console.warn('Failed to reverse audio buffer:', e);
      }
    }

    const source = this.ctx.createBufferSource();
    source.buffer = playBuffer;

    // Pitch tuning via playbackRate (2^(semitones / 12))
    const semitones = params.tune || 0;
    source.playbackRate.setValueAtTime(Math.pow(2, semitones / 12), time);

    // Filter tone (low-pass filter)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoff = 400 + Math.pow(Math.max(0.01, params.tone), 2) * 19000;
    filter.frequency.setValueAtTime(cutoff, time);

    // Gain envelope with velocity and decay
    const gainNode = this.ctx.createGain();
    const velocityScale = Math.max(0.05, params.velocity / 127);
    const totalVolume = Math.min(1.5, (params.volume ?? 0.8) * velocityScale);
    gainNode.gain.setValueAtTime(totalVolume, time);

    const decayDuration = Math.max(0.05, Math.min(5.0, (playBuffer.duration || 0.5) * (params.decay ?? 1.0)));
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + decayDuration);

    // Panning
    const panNode = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panNode) {
      panNode.pan.setValueAtTime(Math.max(-1, Math.min(1, params.pan || 0)), time);
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(panNode);
      panNode.connect(destination);
    } else {
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(destination);
    }

    source.start(time);
    source.stop(time + decayDuration + 0.05);
  }

  private synthesizeDrum(
    soundType: string,
    destination: AudioNode,
    time: number,
    params: SoundParams,
    name?: string
  ): void {
    const type = (soundType || '').toLowerCase();
    const clean = (name || '').toLowerCase();
    const vel = Math.max(0.1, params.velocity / 127);
    const vol = (params.volume ?? 0.8) * vel;
    const semitoneRatio = Math.pow(2, (params.tune || 0) / 12);
    const decayMod = Math.max(0.2, params.decay || 1.0);

    if (type.includes('kick') || clean.includes('bumbo') || clean.includes('surdo') || clean.includes('grave')) {
      // Bass drum / Surdo / Grave synthesis
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = clean.includes('surdo') ? 65 : 55;
      const startFreq = (baseFreq * 2.8) * semitoneRatio;
      const endFreq = baseFreq * semitoneRatio;

      osc.frequency.setValueAtTime(startFreq, time);
      osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.07);

      gain.gain.setValueAtTime(vol * 1.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35 * decayMod);

      osc.connect(gain);
      gain.connect(destination);
      osc.start(time);
      osc.stop(time + 0.4 * decayMod);
    } else if (type.includes('snare') || clean.includes('caixa') || clean.includes('tapa')) {
      // Snare drum / Caixa / Tapa synthesis (oscillator body + noise snap)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 * semitoneRatio, time);
      osc.frequency.exponentialRampToValueAtTime(70 * semitoneRatio, time + 0.08);

      oscGain.gain.setValueAtTime(vol * 0.7, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12 * decayMod);
      osc.connect(oscGain);
      oscGain.connect(destination);
      osc.start(time);
      osc.stop(time + 0.15 * decayMod);

      // Noise snap
      this.playNoiseBurst(destination, time, vol * 0.8, 0.18 * decayMod, 1200);
    } else if (type.includes('hihat') || type.includes('hat') || clean.includes('ganza') || clean.includes('ovinho') || clean.includes('shaker')) {
      // Hi-hat / Ganza / Ovinho / Shaker (Filtered high-frequency noise)
      const dur = type.includes('open') ? 0.35 * decayMod : 0.06 * decayMod;
      this.playNoiseBurst(destination, time, vol * 0.65, dur, 7000);
    } else if (clean.includes('tamborim') || type.includes('rim') || type.includes('clav')) {
      // Tamborim / Rimshot / Clave (High resonant wooden/metallic click)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880 * semitoneRatio, time);
      osc.frequency.exponentialRampToValueAtTime(320 * semitoneRatio, time + 0.04);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08 * decayMod);

      osc.connect(gain);
      gain.connect(destination);
      osc.start(time);
      osc.stop(time + 0.1 * decayMod);
    } else if (clean.includes('agogo') || type.includes('bell') || clean.includes('cowbell')) {
      // Agogô / Cowbell (Dual tuned square/triangle harmonics)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';

      const pitch = clean.includes('agogo agudo') ? 950 : 580;
      osc1.frequency.setValueAtTime(pitch * semitoneRatio, time);
      osc2.frequency.setValueAtTime(pitch * 1.5 * semitoneRatio, time);

      gain.gain.setValueAtTime(vol * 0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28 * decayMod);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(destination);
      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.3 * decayMod);
      osc2.stop(time + 0.3 * decayMod);
    } else {
      // Default percussive click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(260 * semitoneRatio, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.06);

      gain.gain.setValueAtTime(vol * 0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15 * decayMod);

      osc.connect(gain);
      gain.connect(destination);
      osc.start(time);
      osc.stop(time + 0.16 * decayMod);
    }
  }

  private playNoiseBurst(
    destination: AudioNode,
    time: number,
    gainLevel: number,
    duration: number,
    filterFreq: number
  ): void {
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    if (bufferSize <= 0) return;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(filterFreq, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noise.start(time);
    noise.stop(time + duration + 0.02);
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MIDI & Footswitch controller manager for hardware pedals (Cuvave Cube Turner, Page Turner, Bluetooth / USB footswitches).
 */

export interface FootswitchSettings {
  enabled: boolean;
  pedal1Key: string; // Default: ' ' (Space) or 'PageDown'
  pedal2Key: string; // Default: 'Enter' or 'PageUp'
  holdThresholdMs: number; // Hold time to trigger part transition (e.g. 500ms)
  debounceMs: number; // Debounce window to prevent double triggers (e.g. 150ms)
  midiPedal1Note?: number;
  midiPedal2Note?: number;
}

export interface FootswitchCallbacks {
  onPedal1?: () => void;
  onPedal2?: () => void;
  onActivity?: (signal: { type: string; value: string }) => void;
}

const STORAGE_KEY = 'beatbuddy_footswitch_settings';

const DEFAULT_SETTINGS: FootswitchSettings = {
  enabled: true,
  pedal1Key: ' ',
  pedal2Key: 'Enter',
  holdThresholdMs: 450,
  debounceMs: 120,
};

class FootswitchManager {
  private settings: FootswitchSettings = { ...DEFAULT_SETTINGS };
  private callbacks: FootswitchCallbacks = {};
  private learningTarget: 'pedal1' | 'pedal2' | null = null;
  private lastTriggerTime: number = 0;

  constructor() {
    this.loadSettings();
    this.setupMidi();
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  public saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save footswitch settings:', e);
    }
  }

  public getSettings(): FootswitchSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<FootswitchSettings>): void {
    this.settings = { ...this.settings, ...partial };
    this.saveSettings();
  }

  public resetToDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
  }

  public setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    this.saveSettings();
  }

  public getHoldThreshold(): number {
    return this.settings.holdThresholdMs || 450;
  }

  public getDebounceTime(): number {
    return this.settings.debounceMs || 120;
  }

  public setCallbacks(cb: FootswitchCallbacks): void {
    this.callbacks = cb;
  }

  public getLearningTarget(): 'pedal1' | 'pedal2' | null {
    return this.learningTarget;
  }

  public setLearningTarget(target: 'pedal1' | 'pedal2' | null): void {
    this.learningTarget = target;
  }

  public handleKeyEventForLearning(e: KeyboardEvent): void {
    if (!this.learningTarget) return;
    const key = e.key;
    if (this.learningTarget === 'pedal1') {
      this.settings.pedal1Key = key;
    } else if (this.learningTarget === 'pedal2') {
      this.settings.pedal2Key = key;
    }
    this.saveSettings();
    this.notifyActivity({
      type: 'LEARN',
      value: `Pedal ${this.learningTarget === 'pedal1' ? '1' : '2'} configurado para a tecla: "${key}"`,
    });
    this.learningTarget = null;
  }

  public isPedal1Event(e: KeyboardEvent): boolean {
    const key = e.key;
    const target = this.settings.pedal1Key;
    if (target === ' ' && (key === ' ' || key === 'Spacebar' || e.code === 'Space')) return true;
    if (target === 'PageDown' && (key === 'PageDown' || e.code === 'PageDown')) return true;
    return key.toLowerCase() === target.toLowerCase();
  }

  public isPedal2Event(e: KeyboardEvent): boolean {
    const key = e.key;
    const target = this.settings.pedal2Key;
    if (target === 'Enter' && (key === 'Enter' || e.code === 'Enter')) return true;
    if (target === 'PageUp' && (key === 'PageUp' || e.code === 'PageUp')) return true;
    return key.toLowerCase() === target.toLowerCase();
  }

  public notifyActivity(signal: { type: string; value: string }): void {
    this.callbacks.onActivity?.(signal);
  }

  private setupMidi(): void {
    if (typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator) {
      try {
        (navigator as any).requestMIDIAccess?.().then(
          (midiAccess: any) => {
            for (const input of midiAccess.inputs.values()) {
              input.onmidimessage = (msg: any) => this.handleMidiMessage(msg);
            }
            midiAccess.onstatechange = (e: any) => {
              if (e.port.type === 'input' && e.port.state === 'connected') {
                e.port.onmidimessage = (msg: any) => this.handleMidiMessage(msg);
              }
            };
          },
          () => {
            // MIDI access rejected or not available
          }
        );
      } catch {}
    }
  }

  private handleMidiMessage(message: any): void {
    if (!this.settings.enabled) return;
    const data = message.data;
    if (!data || data.length < 3) return;
    const [status, note, velocity] = data;
    const isNoteOn = (status & 0xf0) === 0x90 && velocity > 0;
    const isControlChange = (status & 0xf0) === 0xb0;

    const now = performance.now();
    if (now - this.lastTriggerTime < this.settings.debounceMs) return;

    if (isNoteOn || (isControlChange && velocity > 63)) {
      this.lastTriggerTime = now;
      this.notifyActivity({
        type: 'MIDI',
        value: `MIDI ${isNoteOn ? 'Note ' + note : 'CC ' + note} (Vel: ${velocity})`,
      });

      if (this.learningTarget) {
        if (this.learningTarget === 'pedal1') {
          this.settings.midiPedal1Note = note;
        } else {
          this.settings.midiPedal2Note = note;
        }
        this.saveSettings();
        this.learningTarget = null;
        return;
      }

      if (this.settings.midiPedal1Note !== undefined && note === this.settings.midiPedal1Note) {
        this.callbacks.onPedal1?.();
      } else if (this.settings.midiPedal2Note !== undefined && note === this.settings.midiPedal2Note) {
        this.callbacks.onPedal2?.();
      }
    }
  }
}

export const footswitchManager = new FootswitchManager();

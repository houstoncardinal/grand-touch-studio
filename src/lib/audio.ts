// Audio engine for the digital piano
export type InstrumentType = 'grand-piano' | 'electric-piano' | 'synth' | 'guitar' | 'bells';

interface AudioNote {
  oscillator: OscillatorNode;
  gainNode: GainNode;
}

export class AudioEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private activeNotes: Map<string, AudioNote> = new Map();
  private currentInstrument: InstrumentType = 'grand-piano';

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.3;
  }

  setVolume(volume: number) {
    this.masterGain.gain.value = volume;
  }

  setInstrument(instrument: InstrumentType) {
    this.currentInstrument = instrument;
  }

  private getFrequency(note: string, octave: number): number {
    const noteFrequencies: { [key: string]: number } = {
      'C': 261.63,
      'C#': 277.18,
      'D': 293.66,
      'D#': 311.13,
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99,
      'G': 392.00,
      'G#': 415.30,
      'A': 440.00,
      'A#': 466.16,
      'B': 493.88,
    };

    const baseFreq = noteFrequencies[note];
    return baseFreq * Math.pow(2, octave - 4);
  }

  private getInstrumentSettings(instrument: InstrumentType): {
    waveType: OscillatorType;
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    detune?: number;
  } {
    switch (instrument) {
      case 'grand-piano':
        return { waveType: 'triangle', attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 };
      case 'electric-piano':
        return { waveType: 'sine', attack: 0.02, decay: 0.2, sustain: 0.6, release: 0.3 };
      case 'synth':
        return { waveType: 'sawtooth', attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.2, detune: -5 };
      case 'guitar':
        return { waveType: 'triangle', attack: 0.01, decay: 0.5, sustain: 0.3, release: 0.8 };
      case 'bells':
        return { waveType: 'sine', attack: 0.001, decay: 0.8, sustain: 0.2, release: 1.5 };
      default:
        return { waveType: 'sine', attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.5 };
    }
  }

  playNote(note: string, octave: number) {
    const key = `${note}-${octave}`;
    if (this.activeNotes.has(key)) return;

    const frequency = this.getFrequency(note, octave);
    const settings = this.getInstrumentSettings(this.currentInstrument);

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = settings.waveType;
    oscillator.frequency.value = frequency;
    
    if (settings.detune) {
      oscillator.detune.value = settings.detune;
    }

    // ADSR Envelope
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + settings.attack);
    gainNode.gain.linearRampToValueAtTime(settings.sustain, now + settings.attack + settings.decay);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(now);

    this.activeNotes.set(key, { oscillator, gainNode });
  }

  stopNote(note: string, octave: number) {
    const key = `${note}-${octave}`;
    const activeNote = this.activeNotes.get(key);

    if (!activeNote) return;

    const settings = this.getInstrumentSettings(this.currentInstrument);
    const now = this.audioContext.currentTime;

    activeNote.gainNode.gain.cancelScheduledValues(now);
    activeNote.gainNode.gain.setValueAtTime(activeNote.gainNode.gain.value, now);
    activeNote.gainNode.gain.linearRampToValueAtTime(0, now + settings.release);

    activeNote.oscillator.stop(now + settings.release);
    this.activeNotes.delete(key);
  }

  stopAllNotes() {
    this.activeNotes.forEach((_, key) => {
      const [note, octave] = key.split('-');
      this.stopNote(note, parseInt(octave));
    });
  }
}

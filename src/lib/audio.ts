// Professional audio engine for realistic piano sounds
export type InstrumentType = 'grand-piano' | 'electric-piano' | 'synth' | 'guitar' | 'bells';

interface AudioNote {
  oscillators: OscillatorNode[];
  gainNode: GainNode;
  filterNode?: BiquadFilterNode;
}

export class AudioEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private reverbNode: ConvolverNode;
  private reverbGain: GainNode;
  private activeNotes: Map<string, AudioNote> = new Map();
  private currentInstrument: InstrumentType = 'grand-piano';

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.reverbGain = this.audioContext.createGain();
    this.reverbNode = this.audioContext.createConvolver();
    
    // Create simple reverb impulse response
    this.createReverb();
    
    this.reverbGain.gain.value = 0.15;
    this.masterGain.gain.value = 0.35;
    
    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.audioContext.destination);
    this.masterGain.connect(this.audioContext.destination);
  }

  private createReverb() {
    const rate = this.audioContext.sampleRate;
    const length = rate * 2; // 2 second reverb
    const impulse = this.audioContext.createBuffer(2, length, rate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    this.reverbNode.buffer = impulse;
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
    layers: { waveType: OscillatorType; detune: number; gain: number }[];
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    useFilter?: boolean;
    filterFreq?: number;
    filterQ?: number;
    useReverb?: boolean;
  } {
    switch (instrument) {
      case 'grand-piano':
        return {
          layers: [
            { waveType: 'triangle', detune: 0, gain: 0.4 },
            { waveType: 'sine', detune: -5, gain: 0.3 },
            { waveType: 'sine', detune: 1200, gain: 0.15 }, // Octave harmonic
            { waveType: 'sine', detune: 1900, gain: 0.1 }, // Fifth harmonic
          ],
          attack: 0.008,
          decay: 0.4,
          sustain: 0.35,
          release: 0.6,
          useFilter: true,
          filterFreq: 3000,
          filterQ: 1,
          useReverb: true,
        };
      case 'electric-piano':
        return {
          layers: [
            { waveType: 'sine', detune: 0, gain: 0.5 },
            { waveType: 'triangle', detune: -3, gain: 0.25 },
            { waveType: 'sine', detune: 1203, gain: 0.15 },
          ],
          attack: 0.015,
          decay: 0.3,
          sustain: 0.5,
          release: 0.4,
          useFilter: true,
          filterFreq: 2500,
          filterQ: 0.8,
          useReverb: true,
        };
      case 'synth':
        return {
          layers: [
            { waveType: 'sawtooth', detune: 0, gain: 0.35 },
            { waveType: 'sawtooth', detune: -7, gain: 0.35 },
            { waveType: 'square', detune: 1200, gain: 0.2 },
          ],
          attack: 0.05,
          decay: 0.15,
          sustain: 0.7,
          release: 0.3,
          useFilter: true,
          filterFreq: 1500,
          filterQ: 2,
          useReverb: false,
        };
      case 'guitar':
        return {
          layers: [
            { waveType: 'triangle', detune: 0, gain: 0.4 },
            { waveType: 'sawtooth', detune: -2, gain: 0.2 },
            { waveType: 'sine', detune: 1200, gain: 0.15 },
            { waveType: 'sine', detune: 2400, gain: 0.08 },
          ],
          attack: 0.005,
          decay: 0.6,
          sustain: 0.25,
          release: 0.9,
          useFilter: true,
          filterFreq: 2000,
          filterQ: 1.5,
          useReverb: true,
        };
      case 'bells':
        return {
          layers: [
            { waveType: 'sine', detune: 0, gain: 0.4 },
            { waveType: 'sine', detune: 1200, gain: 0.25 },
            { waveType: 'sine', detune: 1900, gain: 0.2 },
            { waveType: 'sine', detune: 2400, gain: 0.15 },
            { waveType: 'triangle', detune: 3600, gain: 0.1 },
          ],
          attack: 0.001,
          decay: 1.2,
          sustain: 0.15,
          release: 2.0,
          useFilter: true,
          filterFreq: 4000,
          filterQ: 0.5,
          useReverb: true,
        };
      default:
        return {
          layers: [{ waveType: 'sine', detune: 0, gain: 1 }],
          attack: 0.01,
          decay: 0.3,
          sustain: 0.5,
          release: 0.5,
        };
    }
  }

  playNote(note: string, octave: number) {
    const key = `${note}-${octave}`;
    if (this.activeNotes.has(key)) return;

    const frequency = this.getFrequency(note, octave);
    const settings = this.getInstrumentSettings(this.currentInstrument);

    const gainNode = this.audioContext.createGain();
    const oscillators: OscillatorNode[] = [];
    
    let filterNode: BiquadFilterNode | undefined;
    
    if (settings.useFilter) {
      filterNode = this.audioContext.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.value = settings.filterFreq || 2000;
      filterNode.Q.value = settings.filterQ || 1;
    }

    // Create layered oscillators for rich sound
    settings.layers.forEach((layer) => {
      const oscillator = this.audioContext.createOscillator();
      const layerGain = this.audioContext.createGain();
      
      oscillator.type = layer.waveType;
      oscillator.frequency.value = frequency;
      oscillator.detune.value = layer.detune;
      layerGain.gain.value = layer.gain;
      
      oscillator.connect(layerGain);
      
      if (filterNode) {
        layerGain.connect(filterNode);
      } else {
        layerGain.connect(gainNode);
      }
      
      oscillators.push(oscillator);
    });
    
    if (filterNode) {
      filterNode.connect(gainNode);
    }

    // ADSR Envelope
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + settings.attack);
    gainNode.gain.linearRampToValueAtTime(settings.sustain, now + settings.attack + settings.decay);

    gainNode.connect(this.masterGain);
    
    if (settings.useReverb) {
      gainNode.connect(this.reverbNode);
    }

    oscillators.forEach(osc => osc.start(now));

    this.activeNotes.set(key, { oscillators, gainNode, filterNode });
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

    activeNote.oscillators.forEach(osc => osc.stop(now + settings.release));
    this.activeNotes.delete(key);
  }

  stopAllNotes() {
    this.activeNotes.forEach((_, key) => {
      const [note, octave] = key.split('-');
      this.stopNote(note, parseInt(octave));
    });
  }
}


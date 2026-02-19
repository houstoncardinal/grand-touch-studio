// Professional audio engine with world-class instrument synthesis
export type InstrumentType =
  | 'grand-piano'
  | 'electric-piano'
  | 'synth'
  | 'guitar'
  | 'bells'
  | 'organ'
  | 'strings'
  | 'harp'
  | 'flute'
  | 'brass'
  | 'marimba'
  | 'clavinet'
  | 'celesta'
  | 'accordion';

interface AudioNote {
  oscillators: OscillatorNode[];
  gainNode: GainNode;
  filterNode?: BiquadFilterNode;
  lfoNode?: OscillatorNode;
  lfoGain?: GainNode;
}

interface InstrumentSettings {
  layers: { waveType: OscillatorType; detune: number; gain: number }[];
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  useFilter?: boolean;
  filterType?: BiquadFilterType;
  filterFreq?: number;
  filterQ?: number;
  filterEnvAmount?: number;
  useReverb?: boolean;
  reverbMix?: number;
  useLFO?: boolean;
  lfoRate?: number;
  lfoDepth?: number;
  lfoTarget?: 'gain' | 'pitch' | 'filter';
  velocityCurve?: number;
  stereoWidth?: number;
}

export class AudioEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private compressor: DynamicsCompressorNode;
  private reverbNode: ConvolverNode;
  private reverbGain: GainNode;
  private dryGain: GainNode;
  private activeNotes: Map<string, AudioNote> = new Map();
  private currentInstrument: InstrumentType = 'grand-piano';

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ latencyHint: 'interactive' });

    // Master compressor for polish
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -18;
    this.compressor.knee.value = 12;
    this.compressor.ratio.value = 4;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.15;

    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.35;

    // Dry path
    this.dryGain = this.audioContext.createGain();
    this.dryGain.gain.value = 1;

    // Reverb path
    this.reverbNode = this.audioContext.createConvolver();
    this.reverbGain = this.audioContext.createGain();
    this.reverbGain.gain.value = 0.2;

    this.createReverb();

    // Routing: masterGain -> compressor -> destination
    //          masterGain -> reverbNode -> reverbGain -> compressor
    this.dryGain.connect(this.compressor);
    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.compressor);
    this.compressor.connect(this.audioContext.destination);
    this.masterGain.connect(this.dryGain);
  }

  private createReverb() {
    const rate = this.audioContext.sampleRate;
    const length = rate * 2.5;
    const impulse = this.audioContext.createBuffer(2, length, rate);

    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Exponential decay with early reflections
        const t = i / rate;
        const earlyReflection = t < 0.03 ? Math.random() * 0.6 : 0;
        const lateReverb = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.8);
        data[i] = earlyReflection + lateReverb;
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
    const semitones: Record<string, number> = {
      'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4,
      'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2,
    };
    const s = semitones[note];
    // A4 = 440 Hz
    return 440 * Math.pow(2, (octave - 4) + s / 12);
  }

  private getInstrumentSettings(instrument: InstrumentType): InstrumentSettings {
    switch (instrument) {
      case 'grand-piano':
        return {
          layers: [
            { waveType: 'triangle', detune: 0, gain: 0.35 },
            { waveType: 'sine', detune: -3, gain: 0.28 },
            { waveType: 'sine', detune: 1200, gain: 0.12 },   // octave harmonic
            { waveType: 'sine', detune: 1902, gain: 0.07 },   // 5th harmonic (just intonation)
            { waveType: 'sine', detune: 2400, gain: 0.04 },   // 2nd octave
            { waveType: 'sine', detune: 2786, gain: 0.025 },  // major 3rd
          ],
          attack: 0.005,
          decay: 0.5,
          sustain: 0.3,
          release: 0.8,
          useFilter: true,
          filterFreq: 4500,
          filterQ: 0.7,
          filterEnvAmount: 2000,
          useReverb: true,
          reverbMix: 0.2,
        };

      case 'electric-piano':
        return {
          layers: [
            { waveType: 'sine', detune: 0, gain: 0.4 },
            { waveType: 'triangle', detune: -2, gain: 0.2 },
            { waveType: 'sine', detune: 1200, gain: 0.18 },
            { waveType: 'sine', detune: 2400, gain: 0.08 },
            { waveType: 'sine', detune: 3600, gain: 0.04 },
          ],
          attack: 0.008,
          decay: 0.35,
          sustain: 0.45,
          release: 0.5,
          useFilter: true,
          filterFreq: 3200,
          filterQ: 0.9,
          filterEnvAmount: 1500,
          useReverb: true,
          reverbMix: 0.18,
          useLFO: true,
          lfoRate: 4.5,
          lfoDepth: 3,
          lfoTarget: 'pitch',
        };

      case 'synth':
        return {
          layers: [
            { waveType: 'sawtooth', detune: 0, gain: 0.28 },
            { waveType: 'sawtooth', detune: -7, gain: 0.28 },
            { waveType: 'sawtooth', detune: 7, gain: 0.15 },
            { waveType: 'square', detune: 1200, gain: 0.12 },
          ],
          attack: 0.04,
          decay: 0.2,
          sustain: 0.65,
          release: 0.35,
          useFilter: true,
          filterType: 'lowpass',
          filterFreq: 1800,
          filterQ: 3,
          filterEnvAmount: 3000,
          useReverb: false,
        };

      case 'guitar':
        return {
          layers: [
            { waveType: 'triangle', detune: 0, gain: 0.35 },
            { waveType: 'sawtooth', detune: -1, gain: 0.12 },
            { waveType: 'sine', detune: 1200, gain: 0.18 },
            { waveType: 'sine', detune: 2400, gain: 0.1 },
            { waveType: 'sine', detune: 3600, gain: 0.05 },
          ],
          attack: 0.003,
          decay: 0.8,
          sustain: 0.18,
          release: 1.2,
          useFilter: true,
          filterFreq: 2800,
          filterQ: 1.8,
          filterEnvAmount: 2000,
          useReverb: true,
          reverbMix: 0.15,
        };

      case 'bells':
        return {
          layers: [
            { waveType: 'sine', detune: 0, gain: 0.3 },
            { waveType: 'sine', detune: 1200, gain: 0.22 },
            { waveType: 'sine', detune: 1902, gain: 0.18 },
            { waveType: 'sine', detune: 2400, gain: 0.14 },
            { waveType: 'sine', detune: 2786, gain: 0.1 },
            { waveType: 'triangle', detune: 3600, gain: 0.08 },
          ],
          attack: 0.001,
          decay: 1.5,
          sustain: 0.1,
          release: 2.5,
          useFilter: true,
          filterFreq: 5000,
          filterQ: 0.5,
          useReverb: true,
          reverbMix: 0.35,
        };

      case 'organ':
        return {
          layers: [
            { waveType: 'sine', detune: 0, gain: 0.25 },      // fundamental (8')
            { waveType: 'sine', detune: -1200, gain: 0.18 },   // sub-octave (16')
            { waveType: 'sine', detune: 1200, gain: 0.2 },     // octave (4')
            { waveType: 'sine', detune: 1902, gain: 0.15 },    // 5th (2 2/3')
            { waveType: 'sine', detune: 2400, gain: 0.12 },    // 2nd octave (2')
            { waveType: 'sine', detune: 2786, gain: 0.08 },    // 3rd (1 3/5')
          ],
          attack: 0.015,
          decay: 0.05,
          sustain: 0.9,
          release: 0.08,
          useFilter: false,
          useReverb: true,
          reverbMix: 0.25,
          useLFO: true,
          lfoRate: 6.5,
          lfoDepth: 4,
          lfoTarget: 'pitch',
        };

      case 'strings':
        return {
          layers: [
            { waveType: 'sawtooth', detune: 0, gain: 0.18 },
            { waveType: 'sawtooth', detune: -5, gain: 0.18 },
            { waveType: 'sawtooth', detune: 5, gain: 0.15 },
            { waveType: 'sawtooth', detune: -12, gain: 0.1 },
            { waveType: 'triangle', detune: 1200, gain: 0.06 },
          ],
          attack: 0.12,
          decay: 0.3,
          sustain: 0.75,
          release: 0.6,
          useFilter: true,
          filterFreq: 3500,
          filterQ: 0.5,
          filterEnvAmount: 1000,
          useReverb: true,
          reverbMix: 0.3,
          useLFO: true,
          lfoRate: 5,
          lfoDepth: 5,
          lfoTarget: 'pitch',
        };

      case 'harp':
        return {
          layers: [
            { waveType: 'triangle', detune: 0, gain: 0.35 },
            { waveType: 'sine', detune: 0, gain: 0.25 },
            { waveType: 'sine', detune: 1200, gain: 0.15 },
            { waveType: 'sine', detune: 2400, gain: 0.08 },
            { waveType: 'sine', detune: 3600, gain: 0.04 },
          ],
          attack: 0.002,
          decay: 1.0,
          sustain: 0.12,
          release: 1.8,
          useFilter: true,
          filterFreq: 4000,
          filterQ: 0.6,
          filterEnvAmount: 1500,
          useReverb: true,
          reverbMix: 0.28,
        };

      case 'flute':
        return {
          layers: [
            { waveType: 'sine', detune: 0, gain: 0.4 },
            { waveType: 'sine', detune: 1200, gain: 0.08 },
            { waveType: 'triangle', detune: 0, gain: 0.1 },
          ],
          attack: 0.06,
          decay: 0.15,
          sustain: 0.8,
          release: 0.2,
          useFilter: true,
          filterFreq: 6000,
          filterQ: 0.3,
          useReverb: true,
          reverbMix: 0.22,
          useLFO: true,
          lfoRate: 5.5,
          lfoDepth: 6,
          lfoTarget: 'pitch',
        };

      case 'brass':
        return {
          layers: [
            { waveType: 'sawtooth', detune: 0, gain: 0.25 },
            { waveType: 'square', detune: -3, gain: 0.15 },
            { waveType: 'sawtooth', detune: 1200, gain: 0.1 },
            { waveType: 'sine', detune: 0, gain: 0.15 },
          ],
          attack: 0.04,
          decay: 0.2,
          sustain: 0.7,
          release: 0.15,
          useFilter: true,
          filterType: 'lowpass',
          filterFreq: 1200,
          filterQ: 2,
          filterEnvAmount: 4000,
          useReverb: true,
          reverbMix: 0.18,
        };

      case 'marimba':
        return {
          layers: [
            { waveType: 'sine', detune: 0, gain: 0.4 },
            { waveType: 'triangle', detune: 0, gain: 0.15 },
            { waveType: 'sine', detune: 2400, gain: 0.12 },
            { waveType: 'sine', detune: 3600, gain: 0.06 },
          ],
          attack: 0.001,
          decay: 0.6,
          sustain: 0.05,
          release: 0.8,
          useFilter: true,
          filterFreq: 3000,
          filterQ: 1,
          filterEnvAmount: 2500,
          useReverb: true,
          reverbMix: 0.2,
        };

      case 'clavinet':
        return {
          layers: [
            { waveType: 'square', detune: 0, gain: 0.3 },
            { waveType: 'sawtooth', detune: -2, gain: 0.2 },
            { waveType: 'square', detune: 1200, gain: 0.12 },
            { waveType: 'sawtooth', detune: 2400, gain: 0.06 },
          ],
          attack: 0.002,
          decay: 0.4,
          sustain: 0.25,
          release: 0.3,
          useFilter: true,
          filterType: 'bandpass',
          filterFreq: 2000,
          filterQ: 2.5,
          filterEnvAmount: 3000,
          useReverb: false,
        };

      case 'celesta':
        return {
          layers: [
            { waveType: 'sine', detune: 0, gain: 0.35 },
            { waveType: 'sine', detune: 1200, gain: 0.2 },
            { waveType: 'sine', detune: 2400, gain: 0.15 },
            { waveType: 'triangle', detune: 3600, gain: 0.1 },
            { waveType: 'sine', detune: 4800, gain: 0.05 },
          ],
          attack: 0.001,
          decay: 0.8,
          sustain: 0.08,
          release: 1.5,
          useFilter: true,
          filterFreq: 6000,
          filterQ: 0.4,
          useReverb: true,
          reverbMix: 0.35,
        };

      case 'accordion':
        return {
          layers: [
            { waveType: 'square', detune: 0, gain: 0.2 },
            { waveType: 'square', detune: -4, gain: 0.18 },
            { waveType: 'sawtooth', detune: 3, gain: 0.12 },
            { waveType: 'sine', detune: 1200, gain: 0.1 },
          ],
          attack: 0.03,
          decay: 0.08,
          sustain: 0.85,
          release: 0.1,
          useFilter: true,
          filterFreq: 2500,
          filterQ: 1.5,
          useReverb: true,
          reverbMix: 0.15,
          useLFO: true,
          lfoRate: 5.8,
          lfoDepth: 8,
          lfoTarget: 'gain',
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
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const key = `${note}-${octave}`;
    if (this.activeNotes.has(key)) return;

    const frequency = this.getFrequency(note, octave);
    const settings = this.getInstrumentSettings(this.currentInstrument);
    const now = this.audioContext.currentTime;

    const gainNode = this.audioContext.createGain();
    const oscillators: OscillatorNode[] = [];

    let filterNode: BiquadFilterNode | undefined;

    if (settings.useFilter) {
      filterNode = this.audioContext.createBiquadFilter();
      filterNode.type = settings.filterType || 'lowpass';
      filterNode.Q.value = settings.filterQ || 1;

      // Filter envelope - starts low, sweeps up, then decays
      const baseFreq = settings.filterFreq || 2000;
      const envAmount = settings.filterEnvAmount || 0;
      if (envAmount > 0) {
        filterNode.frequency.setValueAtTime(baseFreq * 0.3, now);
        filterNode.frequency.linearRampToValueAtTime(baseFreq + envAmount, now + settings.attack);
        filterNode.frequency.exponentialRampToValueAtTime(baseFreq, now + settings.attack + settings.decay);
      } else {
        filterNode.frequency.value = baseFreq;
      }
    }

    // Create layered oscillators
    settings.layers.forEach((layer) => {
      const osc = this.audioContext.createOscillator();
      const layerGain = this.audioContext.createGain();

      osc.type = layer.waveType;
      osc.frequency.value = frequency;
      osc.detune.value = layer.detune;
      layerGain.gain.value = layer.gain;

      osc.connect(layerGain);

      if (filterNode) {
        layerGain.connect(filterNode);
      } else {
        layerGain.connect(gainNode);
      }

      oscillators.push(osc);
    });

    if (filterNode) {
      filterNode.connect(gainNode);
    }

    // ADSR Envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + settings.attack);
    gainNode.gain.linearRampToValueAtTime(settings.sustain, now + settings.attack + settings.decay);

    // LFO for vibrato / tremolo
    let lfoNode: OscillatorNode | undefined;
    let lfoGainNode: GainNode | undefined;
    if (settings.useLFO && settings.lfoRate && settings.lfoDepth) {
      lfoNode = this.audioContext.createOscillator();
      lfoGainNode = this.audioContext.createGain();
      lfoNode.type = 'sine';
      lfoNode.frequency.value = settings.lfoRate;
      lfoGainNode.gain.value = settings.lfoDepth;

      lfoNode.connect(lfoGainNode);

      if (settings.lfoTarget === 'pitch') {
        oscillators.forEach(osc => lfoGainNode!.connect(osc.detune));
      } else if (settings.lfoTarget === 'gain') {
        lfoGainNode.gain.value = settings.lfoDepth / 100;
        lfoGainNode.connect(gainNode.gain);
      } else if (settings.lfoTarget === 'filter' && filterNode) {
        lfoGainNode.gain.value = settings.lfoDepth * 50;
        lfoGainNode.connect(filterNode.frequency);
      }

      // Delayed vibrato onset for realism
      lfoGainNode.gain.setValueAtTime(0, now);
      const targetDepth = settings.lfoTarget === 'gain' ? settings.lfoDepth / 100 : settings.lfoDepth;
      lfoGainNode.gain.linearRampToValueAtTime(targetDepth, now + 0.15);

      lfoNode.start(now);
    }

    // Routing
    gainNode.connect(this.masterGain);

    if (settings.useReverb) {
      const sendGain = this.audioContext.createGain();
      sendGain.gain.value = settings.reverbMix || 0.2;
      gainNode.connect(sendGain);
      sendGain.connect(this.reverbNode);
    }

    oscillators.forEach(osc => osc.start(now));

    this.activeNotes.set(key, { oscillators, gainNode, filterNode, lfoNode, lfoGain: lfoGainNode });
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

    const stopTime = now + settings.release + 0.05;
    activeNote.oscillators.forEach(osc => osc.stop(stopTime));
    if (activeNote.lfoNode) {
      activeNote.lfoNode.stop(stopTime);
    }

    this.activeNotes.delete(key);
  }

  stopAllNotes() {
    this.activeNotes.forEach((_, key) => {
      const [note, octave] = key.split('-');
      this.stopNote(note, parseInt(octave));
    });
  }
}

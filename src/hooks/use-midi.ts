import { useEffect, useState, useCallback, useRef } from "react";

const MIDI_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function midiToNoteOctave(midiNote: number): { note: string; octave: number } {
  const octave = Math.floor(midiNote / 12) - 1;
  const note = MIDI_NOTES[midiNote % 12];
  return { note, octave };
}

export interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
}

interface UseMidiOptions {
  onNoteOn: (note: string, octave: number, velocity: number) => void;
  onNoteOff: (note: string, octave: number) => void;
}

export function useMidi({ onNoteOn, onNoteOff }: UseMidiOptions) {
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [isSupported] = useState(() => !!navigator.requestMIDIAccess);
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const accessRef = useRef<MIDIAccess | null>(null);

  const handleMidiMessage = useCallback((e: MIDIMessageEvent) => {
    const data = e.data;
    if (!data || data.length < 3) return;

    const status = data[0] & 0xf0;
    const midiNote = data[1];
    const velocity = data[2];

    if (status === 0x90 && velocity > 0) {
      const { note, octave } = midiToNoteOctave(midiNote);
      onNoteOn(note, octave, velocity / 127);
    } else if (status === 0x80 || (status === 0x90 && velocity === 0)) {
      const { note, octave } = midiToNoteOctave(midiNote);
      onNoteOff(note, octave);
    }
  }, [onNoteOn, onNoteOff]);

  const refreshDevices = useCallback((access: MIDIAccess) => {
    const devs: MidiDevice[] = [];
    access.inputs.forEach((input) => {
      devs.push({ id: input.id, name: input.name || 'Unknown', manufacturer: input.manufacturer || '' });
      input.onmidimessage = handleMidiMessage;
    });
    setDevices(devs);
    if (devs.length > 0 && !activeDevice) {
      setActiveDevice(devs[0].id);
    }
  }, [handleMidiMessage, activeDevice]);

  useEffect(() => {
    if (!isSupported) return;

    navigator.requestMIDIAccess({ sysex: false }).then((access) => {
      accessRef.current = access;
      refreshDevices(access);
      access.onstatechange = () => refreshDevices(access);
    }).catch(() => {
      // MIDI access denied or unavailable
    });

    return () => {
      if (accessRef.current) {
        accessRef.current.inputs.forEach((input) => {
          input.onmidimessage = null;
        });
      }
    };
  }, [isSupported, refreshDevices]);

  return { devices, isSupported, activeDevice };
}

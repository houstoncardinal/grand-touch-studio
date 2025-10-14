import { useEffect, useState } from "react";
import { PianoKey } from "./PianoKey";
import { AudioEngine, InstrumentType } from "@/lib/audio";

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const KEYBOARD_MAP: { [key: string]: { note: string; octave: number } } = {
  'a': { note: 'C', octave: 4 },
  'w': { note: 'C#', octave: 4 },
  's': { note: 'D', octave: 4 },
  'e': { note: 'D#', octave: 4 },
  'd': { note: 'E', octave: 4 },
  'f': { note: 'F', octave: 4 },
  't': { note: 'F#', octave: 4 },
  'g': { note: 'G', octave: 4 },
  'y': { note: 'G#', octave: 4 },
  'h': { note: 'A', octave: 4 },
  'u': { note: 'A#', octave: 4 },
  'j': { note: 'B', octave: 4 },
  'k': { note: 'C', octave: 5 },
  'o': { note: 'C#', octave: 5 },
  'l': { note: 'D', octave: 5 },
};

interface PianoProps {
  audioEngine: AudioEngine;
  octaveShift: number;
  currentInstrument: InstrumentType;
}

export const Piano = ({ audioEngine, octaveShift, currentInstrument }: PianoProps) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    audioEngine.setInstrument(currentInstrument);
  }, [currentInstrument, audioEngine]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const mapping = KEYBOARD_MAP[e.key.toLowerCase()];
      if (!mapping) return;

      const adjustedOctave = mapping.octave + octaveShift;
      const key = `${mapping.note}-${adjustedOctave}`;
      
      if (!pressedKeys.has(key)) {
        setPressedKeys(prev => new Set(prev).add(key));
        audioEngine.playNote(mapping.note, adjustedOctave);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const mapping = KEYBOARD_MAP[e.key.toLowerCase()];
      if (!mapping) return;

      const adjustedOctave = mapping.octave + octaveShift;
      const key = `${mapping.note}-${adjustedOctave}`;
      
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      audioEngine.stopNote(mapping.note, adjustedOctave);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [audioEngine, octaveShift, pressedKeys]);

  const getKeyboardKey = (note: string, octave: number): string | undefined => {
    const entry = Object.entries(KEYBOARD_MAP).find(
      ([_, mapping]) => mapping.note === note && mapping.octave === octave - octaveShift
    );
    return entry?.[0].toUpperCase();
  };

  const handlePress = (note: string, octave: number) => {
    const key = `${note}-${octave}`;
    setPressedKeys(prev => new Set(prev).add(key));
    audioEngine.playNote(note, octave);
  };

  const handleRelease = (note: string, octave: number) => {
    const key = `${note}-${octave}`;
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
    audioEngine.stopNote(note, octave);
  };

  const renderOctave = (octave: number) => {
    return (
      <div key={octave} className="flex relative">
        {NOTES.map((note) => {
          const isBlack = note.includes('#');
          const key = `${note}-${octave}`;
          return (
            <PianoKey
              key={key}
              note={note}
              octave={octave}
              isBlack={isBlack}
              isPressed={pressedKeys.has(key)}
              onPress={() => handlePress(note, octave)}
              onRelease={() => handleRelease(note, octave)}
              keyboardKey={getKeyboardKey(note, octave)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-b from-[hsl(var(--card))] to-[hsl(var(--background))] rounded-2xl shadow-2xl">
      <div className="flex">
        {[3 + octaveShift, 4 + octaveShift, 5 + octaveShift].map(renderOctave)}
      </div>
    </div>
  );
};

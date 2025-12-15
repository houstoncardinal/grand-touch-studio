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
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Premium piano body with 3D depth */}
      <div className="relative glass-panel p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl overflow-x-auto">
        {/* Ambient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 rounded-2xl md:rounded-3xl pointer-events-none" />
        
        {/* Top panel shine */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl md:rounded-t-3xl pointer-events-none" />
        
        {/* Signature branding plate */}
        <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="relative px-4 sm:px-6 py-1 sm:py-1.5 bg-gradient-to-b from-amber-200/20 via-amber-100/10 to-amber-200/20 rounded-full border border-amber-300/30 backdrop-blur-sm">
            {/* Gold shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent rounded-full" />
            <p className="relative font-serif text-xs sm:text-sm tracking-[0.2em] text-amber-200/90 italic">
              Siraj Qureshi
            </p>
          </div>
        </div>
        
        {/* Piano keyboard */}
        <div className="relative flex min-w-max mt-6 sm:mt-8">
          {[3 + octaveShift, 4 + octaveShift, 5 + octaveShift].map(renderOctave)}
        </div>
        
        {/* Signature engraving on the right */}
        <div className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 z-10">
          <p className="font-serif text-[10px] sm:text-xs tracking-widest text-amber-300/40 uppercase">
            Est. 2024
          </p>
        </div>
        
        {/* Bottom shadow for depth */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent rounded-b-2xl md:rounded-b-3xl pointer-events-none" />
      </div>
      
      {/* Outer glow for premium feel */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-3xl" />
      </div>
    </div>
  );
};

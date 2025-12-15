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
  highlightedNotes?: string[];
}

export const Piano = ({ audioEngine, octaveShift, currentInstrument, highlightedNotes = [] }: PianoProps) => {
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
          const isHighlighted = highlightedNotes.includes(note);
          return (
            <PianoKey
              key={key}
              note={note}
              octave={octave}
              isBlack={isBlack}
              isPressed={pressedKeys.has(key)}
              isHighlighted={isHighlighted}
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
      {/* Futuristic outer frame */}
      <div className="absolute -inset-3 sm:-inset-4 md:-inset-6 rounded-3xl md:rounded-[2rem] bg-gradient-to-b from-[hsl(225,25%,12%)] via-[hsl(225,28%,8%)] to-[hsl(225,30%,5%)] border border-white/[0.05]" />
      
      {/* Inner glow ring */}
      <div className="absolute -inset-1.5 sm:-inset-2 md:-inset-3 rounded-2xl md:rounded-3xl bg-gradient-to-b from-primary/10 via-transparent to-accent/10 blur-sm" />
      
      {/* Premium piano body with 3D depth */}
      <div className="relative glass-ultra p-3 sm:p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-x-auto">
        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl pointer-events-none">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-scan" />
        </div>
        
        {/* Top panel holographic shine */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent rounded-t-2xl md:rounded-t-3xl pointer-events-none" />
        
        {/* Signature branding plate - Ultra luxury gold */}
        <div className="absolute top-1.5 sm:top-2 md:top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="relative px-4 sm:px-6 md:px-8 py-1 sm:py-1.5 bg-gradient-to-b from-amber-300/20 via-amber-200/10 to-amber-300/20 rounded-full border border-amber-400/40 backdrop-blur-md">
            {/* Gold shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent rounded-full animate-pulse-glow" />
            <p className="relative font-serif text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] text-gold italic font-medium">
              Siraj Qureshi
            </p>
          </div>
        </div>
        
        {/* Piano keyboard container */}
        <div className="relative mt-6 sm:mt-8 md:mt-10">
          {/* Keyboard base with wood grain effect */}
          <div className="absolute -inset-x-1 -bottom-2 h-4 bg-gradient-to-b from-[hsl(25,30%,15%)] to-[hsl(25,35%,10%)] rounded-b-xl" />
          
          {/* Keys */}
          <div className="relative flex min-w-max px-1">
            {[3 + octaveShift, 4 + octaveShift, 5 + octaveShift].map(renderOctave)}
          </div>
        </div>
        
        {/* Signature engraving - bottom right */}
        <div className="absolute bottom-1.5 sm:bottom-2 md:bottom-3 right-2 sm:right-3 md:right-4 z-10">
          <p className="font-serif text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] text-amber-400/50 uppercase">
            Est. 2024
          </p>
        </div>
        
        {/* Side ambient glows */}
        <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
        
        {/* Bottom shadow for depth */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent rounded-b-2xl md:rounded-b-3xl pointer-events-none" />
      </div>
      
      {/* Outer glow for premium feel */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 rounded-3xl animate-pulse-glow" />
      </div>
      
      {/* Floor reflection */}
      <div className="absolute -bottom-8 inset-x-4 h-8 bg-gradient-to-b from-primary/10 to-transparent blur-xl opacity-50 rounded-full" />
    </div>
  );
};

import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { ChevronUp, ChevronDown, Volume2 } from "lucide-react";
import { InstrumentType } from "@/lib/audio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ControlsProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  octaveShift: number;
  onOctaveShift: (shift: number) => void;
  currentInstrument: InstrumentType;
  onInstrumentChange: (instrument: InstrumentType) => void;
}

const INSTRUMENTS: { value: InstrumentType; label: string }[] = [
  { value: 'grand-piano', label: '🎹 Grand Piano' },
  { value: 'electric-piano', label: '🎹 Electric Piano' },
  { value: 'synth', label: '🎛️ Synthesizer' },
  { value: 'guitar', label: '🎸 Guitar' },
  { value: 'bells', label: '🔔 Bells' },
];

export const Controls = ({
  volume,
  onVolumeChange,
  octaveShift,
  onOctaveShift,
  currentInstrument,
  onInstrumentChange,
}: ControlsProps) => {
  return (
    <div className="glass-panel flex flex-col gap-4 p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl relative overflow-hidden">
      {/* Gradient accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative z-10 space-y-4">
        {/* Instrument Selection - Full width on mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
          <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-primary to-accent rounded-full" />
            Instrument
          </span>
          <Select value={currentInstrument} onValueChange={(value) => onInstrumentChange(value as InstrumentType)}>
            <SelectTrigger className="w-full sm:flex-1 bg-secondary/50 backdrop-blur-sm border-white/10 hover:bg-secondary/70 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-panel border-white/10">
              {INSTRUMENTS.map((instrument) => (
                <SelectItem 
                  key={instrument.value} 
                  value={instrument.value}
                  className="hover:bg-primary/20 focus:bg-primary/20"
                >
                  {instrument.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Volume Control */}
          <div className="flex items-center gap-3 flex-1 min-w-0 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 group-hover:from-primary/30 group-hover:to-accent/20 transition-all">
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <Slider
                value={[volume * 100]}
                onValueChange={(values) => onVolumeChange(values[0] / 100)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-primary min-w-[2.5ch] sm:min-w-[3ch] text-right tabular-nums">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Octave Shift */}
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground whitespace-nowrap">Octave</span>
            <div className="flex items-center gap-2 p-1 rounded-lg bg-secondary/30 backdrop-blur-sm">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all shadow-sm"
                onClick={() => onOctaveShift(octaveShift - 1)}
                disabled={octaveShift <= -2}
              >
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <span className="text-base sm:text-lg font-black text-primary min-w-[2.5ch] sm:min-w-[3ch] text-center tabular-nums drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                {octaveShift > 0 ? `+${octaveShift}` : octaveShift}
              </span>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all shadow-sm"
                onClick={() => onOctaveShift(octaveShift + 1)}
                disabled={octaveShift >= 2}
              >
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="flex flex-col gap-4 p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl bg-card border border-border shadow-control">
      {/* Instrument Selection - Full width on mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Instrument:</span>
        <Select value={currentInstrument} onValueChange={(value) => onInstrumentChange(value as InstrumentType)}>
          <SelectTrigger className="w-full sm:flex-1 bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INSTRUMENTS.map((instrument) => (
              <SelectItem key={instrument.value} value={instrument.value}>
                {instrument.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Volume Control */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Slider
              value={[volume * 100]}
              onValueChange={(values) => onVolumeChange(values[0] / 100)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <span className="text-xs sm:text-sm font-medium text-muted-foreground min-w-[2.5ch] sm:min-w-[3ch] text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Octave Shift */}
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">Octave:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => onOctaveShift(octaveShift - 1)}
              disabled={octaveShift <= -2}
            >
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <span className="text-base sm:text-lg font-bold text-primary min-w-[2.5ch] sm:min-w-[3ch] text-center">
              {octaveShift > 0 ? `+${octaveShift}` : octaveShift}
            </span>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => onOctaveShift(octaveShift + 1)}
              disabled={octaveShift >= 2}
            >
              <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

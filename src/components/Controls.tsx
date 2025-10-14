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
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-card border border-border shadow-control">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Volume2 className="w-5 h-5 text-primary" />
        <div className="flex-1 md:w-48">
          <Slider
            value={[volume * 100]}
            onValueChange={(values) => onVolumeChange(values[0] / 100)}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground min-w-[3ch]">
          {Math.round(volume * 100)}%
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Octave:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onOctaveShift(octaveShift - 1)}
            disabled={octaveShift <= -2}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <span className="text-lg font-bold text-primary min-w-[3ch] text-center">
            {octaveShift > 0 ? `+${octaveShift}` : octaveShift}
          </span>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onOctaveShift(octaveShift + 1)}
            disabled={octaveShift >= 2}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <span className="text-sm font-medium text-muted-foreground">Instrument:</span>
        <Select value={currentInstrument} onValueChange={(value) => onInstrumentChange(value as InstrumentType)}>
          <SelectTrigger className="w-[200px] bg-secondary border-border">
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
    </div>
  );
};

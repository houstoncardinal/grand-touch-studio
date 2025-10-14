import { useState, useEffect } from "react";
import { Piano } from "@/components/Piano";
import { Controls } from "@/components/Controls";
import { AudioEngine, InstrumentType } from "@/lib/audio";
import { Music } from "lucide-react";

const Index = () => {
  const [audioEngine] = useState(() => new AudioEngine());
  const [volume, setVolume] = useState(0.3);
  const [octaveShift, setOctaveShift] = useState(0);
  const [currentInstrument, setCurrentInstrument] = useState<InstrumentType>('grand-piano');

  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume, audioEngine]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background via-background to-card">
      <div className="w-full max-w-7xl space-y-8">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-glow animate-glow-pulse">
              <Music className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Digital Piano Studio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional-grade digital piano with realistic sounds. Play with your keyboard or touch!
          </p>
        </header>

        <div className="space-y-6">
          <Controls
            volume={volume}
            onVolumeChange={setVolume}
            octaveShift={octaveShift}
            onOctaveShift={setOctaveShift}
            currentInstrument={currentInstrument}
            onInstrumentChange={setCurrentInstrument}
          />

          <Piano
            audioEngine={audioEngine}
            octaveShift={octaveShift}
            currentInstrument={currentInstrument}
          />

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>💡 Use your keyboard to play: A-L keys for notes</p>
            <p className="text-xs">Touch and click the keys with your mouse or finger</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

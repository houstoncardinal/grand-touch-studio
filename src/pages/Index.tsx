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
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-8 bg-gradient-to-br from-background via-background to-card">
      <div className="w-full max-w-7xl space-y-6 sm:space-y-8">
        <header className="text-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-primary to-accent rounded-xl sm:rounded-2xl shadow-glow animate-glow-pulse">
              <Music className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent px-4">
            Digital Piano Studio
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Professional-grade digital piano with realistic sounds. Play with your keyboard or touch!
          </p>
        </header>

        <div className="space-y-4 sm:space-y-6">
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

          <div className="text-center text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-2 px-4">
            <p className="hidden sm:block">💡 Use your keyboard to play: A-L keys for notes</p>
            <p className="sm:text-xs">Touch the keys to play beautiful music 🎵</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;


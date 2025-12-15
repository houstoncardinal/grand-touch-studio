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
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-8 relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      <div className="w-full max-w-7xl space-y-6 sm:space-y-8 relative z-10">
        <header className="text-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl sm:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-primary to-accent rounded-xl sm:rounded-2xl shadow-glow">
                <Music className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent px-4 drop-shadow-2xl">
              Digital Piano Studio
            </h1>
            <p className="font-serif text-lg sm:text-xl md:text-2xl tracking-[0.15em] bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent italic">
              by Siraj Qureshi
            </p>
            <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-300/50 to-transparent rounded-full" />
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground/90 max-w-2xl mx-auto px-4 font-medium">
            Experience ultra-luxury professional-grade sound with stunning visual fidelity
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

          <div className="text-center text-xs sm:text-sm text-muted-foreground/70 space-y-1 sm:space-y-2 px-4">
            <p className="hidden sm:block font-medium">
              🎹 <span className="text-primary/80">Keyboard shortcuts:</span> A-L keys for notes
            </p>
            <p className="sm:text-xs font-medium">
              ✨ Touch the keys to create beautiful music
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;



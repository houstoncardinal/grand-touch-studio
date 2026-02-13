import { useState, useEffect, useCallback } from "react";
import { Piano } from "@/components/Piano";
import { Controls } from "@/components/Controls";
import { MobileToolbar } from "@/components/MobileToolbar";
import { LearnMode } from "@/components/LearnMode";
import { LanguageSelector } from "@/components/LanguageSelector";
import { PricingSection } from "@/components/PricingSection";
import { SEOHead, WebAppSchema } from "@/components/SEOHead";
import { NoteVisualizer } from "@/components/NoteVisualizer";
import { RecordingControls } from "@/components/RecordingControls";
import { UserMenu } from "@/components/UserMenu";
import { AudioEngine, InstrumentType } from "@/lib/audio";
import { getTranslation } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { Music, Globe, Keyboard, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Mode = 'play' | 'learn' | 'settings' | 'pricing';

interface RecordedNote {
  note: string;
  octave: number;
  timestamp: number;
  duration: number;
}

const Index = () => {
  const [audioEngine] = useState(() => new AudioEngine());
  const [volume, setVolume] = useState(0.3);
  const [octaveShift, setOctaveShift] = useState(0);
  const [currentInstrument, setCurrentInstrument] = useState<InstrumentType>('grand-piano');
  const [currentMode, setCurrentMode] = useState<Mode>('play');
  const [language, setLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([]);
  const [activeNoteKeys, setActiveNoteKeys] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordStartTime, setRecordStartTime] = useState(0);
  const [noteStartTimes, setNoteStartTimes] = useState<Map<string, number>>(new Map());

  const { subscription } = useAuth();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume, audioEngine]);

  const handleStartLesson = (notes: string[]) => {
    setHighlightedNotes(notes);
    setCurrentMode('play');
  };

  const handleNoteOn = useCallback((note: string, octave: number) => {
    const key = `${note}-${octave}`;
    setActiveNoteKeys(prev => [...prev, key]);

    if (isRecording) {
      setNoteStartTimes(prev => new Map(prev).set(key, Date.now() - recordStartTime));
    }
  }, [isRecording, recordStartTime]);

  const handleNoteOff = useCallback((note: string, octave: number) => {
    const key = `${note}-${octave}`;
    setActiveNoteKeys(prev => prev.filter(k => k !== key));

    if (isRecording) {
      setNoteStartTimes(prev => {
        const startTime = prev.get(key);
        if (startTime !== undefined) {
          const duration = (Date.now() - recordStartTime) - startTime;
          setRecordedNotes(notes => [...notes, { note, octave, timestamp: startTime, duration }]);
          const next = new Map(prev);
          next.delete(key);
          return next;
        }
        return prev;
      });
    }
  }, [isRecording, recordStartTime]);

  const startRecording = () => {
    setRecordedNotes([]);
    setRecordStartTime(Date.now());
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setNoteStartTimes(new Map());
  };

  const playRecording = () => {
    if (recordedNotes.length === 0 || isPlaying) return;
    setIsPlaying(true);

    recordedNotes.forEach(({ note, octave, timestamp, duration }) => {
      setTimeout(() => audioEngine.playNote(note, octave), timestamp);
      setTimeout(() => audioEngine.stopNote(note, octave), timestamp + duration);
    });

    const lastNote = recordedNotes[recordedNotes.length - 1];
    const totalDuration = lastNote.timestamp + lastNote.duration;
    setTimeout(() => setIsPlaying(false), totalDuration);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden">
      <SEOHead />
      <WebAppSchema />

      {/* Futuristic ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/15 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vh] bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 blur-[80px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="w-full max-w-7xl space-y-4 sm:space-y-6 md:space-y-8 relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-2 sm:space-y-3 md:space-y-4"
        >
          <div className="hidden md:flex justify-between items-center mb-2">
            <div />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLanguageSelector(true)}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Globe className="w-4 h-4" />
                {t('language')}
              </Button>
              <UserMenu />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-xl sm:rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse-glow" />
              <div className="relative p-2.5 sm:p-3 md:p-4 bg-gradient-to-br from-primary via-primary to-accent rounded-xl sm:rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <Music className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
              </div>
            </motion.div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-luxury px-4 drop-shadow-2xl">
              {t('title')}
            </h1>
            <p className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl tracking-[0.1em] sm:tracking-[0.15em] text-gold italic">
              {t('byLine')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 sm:w-16 md:w-24 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
              <div className="h-px w-12 sm:w-16 md:w-24 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            </div>
          </div>
          
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground/80 max-w-2xl mx-auto px-4 font-medium">
            {t('subtitle')}
          </p>
        </motion.header>

        {/* Mode tabs - Desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex justify-center gap-2"
        >
          {(['play', 'learn', 'pricing'] as Mode[]).map((mode) => (
            <Button
              key={mode}
              variant={currentMode === mode ? 'default' : 'ghost'}
              onClick={() => setCurrentMode(mode)}
              className={currentMode === mode ? 'bg-gradient-to-r from-primary to-accent' : ''}
            >
              {mode === 'play' && <Keyboard className="w-4 h-4 mr-2" />}
              {mode === 'learn' && <Music className="w-4 h-4 mr-2" />}
              {mode === 'pricing' && <Crown className="w-4 h-4 mr-2" />}
              {mode === 'pricing' ? 'Premium' : t(mode as 'play' | 'learn')}
            </Button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            {currentMode === 'learn' && (
              <LearnMode onStartLesson={handleStartLesson} />
            )}
            
            {(currentMode === 'play' || currentMode === 'settings') && (
              <Controls
                volume={volume}
                onVolumeChange={setVolume}
                octaveShift={octaveShift}
                onOctaveShift={setOctaveShift}
                currentInstrument={currentInstrument}
                onInstrumentChange={setCurrentInstrument}
              />
            )}

            {(currentMode === 'play' || currentMode === 'learn') && (
              <>
                {/* Recording controls */}
                {currentMode === 'play' && (
                  <RecordingControls
                    isRecording={isRecording}
                    onStartRecording={startRecording}
                    onStopRecording={stopRecording}
                    recordedNotes={recordedNotes}
                    onPlayback={playRecording}
                    onClearRecording={() => setRecordedNotes([])}
                    isPlaying={isPlaying}
                    isPremium={subscription.subscribed}
                  />
                )}

                {/* Piano with visualizer */}
                <div className="relative">
                  <NoteVisualizer activeNotes={activeNoteKeys} />
                  <Piano
                    audioEngine={audioEngine}
                    octaveShift={octaveShift}
                    currentInstrument={currentInstrument}
                    highlightedNotes={highlightedNotes}
                    onNoteOn={handleNoteOn}
                    onNoteOff={handleNoteOff}
                  />
                </div>
              </>
            )}

            {currentMode === 'pricing' && (
              <PricingSection language={language} />
            )}

            {(currentMode === 'play' || currentMode === 'learn') && (
              <div className="text-center text-[10px] sm:text-xs md:text-sm text-muted-foreground/60 space-y-1 px-4">
                <p className="hidden sm:block font-medium">
                  <span className="text-primary/70">🎹 {t('keyboardTip')}</span>
                </p>
                <p className="font-medium">
                  ✨ {t('touchTip')}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <MobileToolbar
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        onLanguageClick={() => setShowLanguageSelector(true)}
      />

      <LanguageSelector
        currentLanguage={language}
        onLanguageChange={setLanguage}
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </div>
  );
};

export default Index;

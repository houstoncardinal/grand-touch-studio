import { useState, useRef, useEffect } from "react";
import { Circle, Square, Play, Pause, Download, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface RecordedNote {
  note: string;
  octave: number;
  timestamp: number;
  duration: number;
}

interface RecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  recordedNotes: RecordedNote[];
  onPlayback: () => void;
  onClearRecording: () => void;
  isPlaying: boolean;
  isPremium: boolean;
}

export const RecordingControls = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  recordedNotes,
  onPlayback,
  onClearRecording,
  isPlaying,
  isPremium,
}: RecordingControlsProps) => {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRecording) {
      const start = Date.now();
      timerRef.current = setInterval(() => setElapsed(Date.now() - start), 100);
    } else {
      clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-3 sm:p-4 flex items-center gap-3 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3 w-full">
        {/* Record button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={cn(
            "h-10 w-10 rounded-full transition-all",
            isRecording
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-secondary/50 text-foreground hover:bg-red-500/20 hover:text-red-400"
          )}
        >
          {isRecording ? <Square className="w-4 h-4" /> : <Circle className="w-4 h-4 fill-current" />}
        </Button>

        {/* Timer */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-mono font-bold text-red-400 tabular-nums">
                {formatTime(elapsed)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note count */}
        {recordedNotes.length > 0 && !isRecording && (
          <span className="text-xs text-muted-foreground">
            {recordedNotes.length} notes
          </span>
        )}

        <div className="flex-1" />

        {/* Playback controls */}
        {recordedNotes.length > 0 && !isRecording && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPlayback}
              className="h-9 w-9 bg-primary/10 text-primary hover:bg-primary/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            {isPremium && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-accent/10 text-accent hover:bg-accent/20"
                onClick={() => {
                  // Export functionality placeholder
                  alert("Export feature coming soon!");
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onClearRecording}
              className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

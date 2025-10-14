import { cn } from "@/lib/utils";

interface PianoKeyProps {
  note: string;
  octave: number;
  isBlack: boolean;
  isPressed: boolean;
  onPress: () => void;
  onRelease: () => void;
}

export const PianoKey = ({
  note,
  octave,
  isBlack,
  isPressed,
  onPress,
  onRelease,
}: PianoKeyProps) => {
  const displayNote = note.replace('#', '♯');
  
  return (
    <button
      className={cn(
        "relative select-none transition-all touch-manipulation group",
        isBlack
          ? cn(
              "h-24 sm:h-28 md:h-32 w-8 sm:w-9 md:w-10 z-10 -mx-4 sm:-mx-[18px] md:-mx-5 rounded-b-lg",
              "key-black-gradient",
              "border-2 border-[hsl(var(--black-key-shadow))]",
              "before:absolute before:inset-0 before:rounded-b-lg before:opacity-0 before:transition-opacity",
              "before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none",
              "after:absolute after:top-0 after:left-0 after:right-0 after:h-1/3 after:rounded-t-lg",
              "after:bg-gradient-to-b after:from-white/10 after:to-transparent after:pointer-events-none",
              isPressed
                ? "translate-y-2 brightness-150 before:opacity-100 glow-effect scale-[0.98]"
                : "hover:brightness-125 hover:before:opacity-60 active:brightness-150",
            )
          : cn(
              "h-36 sm:h-42 md:h-48 w-11 sm:w-12 md:w-14 rounded-b-lg overflow-hidden",
              "key-white-gradient",
              "border-x-2 border-b-2 border-[hsl(var(--white-key-shadow))]",
              "before:absolute before:inset-0 before:rounded-b-lg before:opacity-100 before:transition-all",
              "before:bg-gradient-to-b before:from-white/30 before:via-transparent before:to-black/5 before:pointer-events-none",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-2 after:opacity-30",
              "after:bg-gradient-to-t after:from-black/20 after:to-transparent after:pointer-events-none",
              "shadow-[0_8px_16px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(255,255,255,0.3)]",
              isPressed
                ? "translate-y-2 scale-[0.98] brightness-110 glow-effect before:opacity-0 shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                : "hover:brightness-95 active:brightness-110 hover:shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
            ),
      )}
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
      onTouchStart={(e) => {
        e.preventDefault();
        onPress();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onRelease();
      }}
      onTouchCancel={(e) => {
        e.preventDefault();
        onRelease();
      }}
    >
      {/* Shine effect on white keys */}
      {!isBlack && (
        <div className={cn(
          "absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-lg pointer-events-none opacity-80 transition-opacity",
          isPressed && "opacity-0"
        )} />
      )}
      
      {/* Note label */}
      <span
        className={cn(
          "absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold pointer-events-none transition-all",
          isBlack 
            ? "text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" 
            : "text-foreground/50 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]",
          isPressed && (isBlack ? "text-white" : "text-primary")
        )}
      >
        {displayNote}
      </span>
      
      {/* Octave number for white keys */}
      {!isBlack && (
        <span
          className={cn(
            "absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-semibold opacity-25 pointer-events-none",
            "text-foreground drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]"
          )}
        >
          {octave}
        </span>
      )}
      
      {/* Active glow indicator */}
      {isPressed && (
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-accent/20 rounded-b-lg pointer-events-none animate-pulse" />
      )}
    </button>
  );
};



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
        "relative select-none transition-all touch-manipulation",
        isBlack
          ? cn(
              "h-24 sm:h-28 md:h-32 w-8 sm:w-9 md:w-10 z-10 -mx-4 sm:-mx-[18px] md:-mx-5 rounded-b-lg",
              "bg-gradient-to-b from-[hsl(var(--black-key))] to-[hsl(var(--black-key-shadow))]",
              "border-2 border-[hsl(var(--black-key-shadow))]",
              isPressed
                ? "translate-y-1 shadow-none brightness-150"
                : "shadow-key hover:brightness-125 active:brightness-150"
            )
          : cn(
              "h-36 sm:h-42 md:h-48 w-11 sm:w-12 md:w-14 rounded-b-lg",
              "bg-gradient-to-b from-[hsl(var(--white-key))] via-[hsl(var(--white-key))] to-[hsl(var(--white-key-shadow))]",
              "border-2 border-[hsl(var(--border))]",
              isPressed
                ? "translate-y-1 shadow-none bg-gradient-to-b from-[hsl(var(--key-active))] to-[hsl(var(--primary))]"
                : "shadow-key hover:brightness-95 active:brightness-90"
            ),
        isPressed && "shadow-glow"
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
      <span
        className={cn(
          "absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-semibold pointer-events-none",
          isBlack ? "text-white/60" : "text-foreground/40"
        )}
      >
        {displayNote}
      </span>
      {!isBlack && (
        <span
          className={cn(
            "absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-medium opacity-30 pointer-events-none",
            "text-foreground"
          )}
        >
          {octave}
        </span>
      )}
    </button>
  );
};


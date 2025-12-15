import { cn } from "@/lib/utils";

interface PianoKeyProps {
  note: string;
  octave: number;
  isBlack: boolean;
  isPressed: boolean;
  isHighlighted?: boolean;
  onPress: () => void;
  onRelease: () => void;
}

export const PianoKey = ({
  note,
  octave,
  isBlack,
  isPressed,
  isHighlighted,
  onPress,
  onRelease,
}: PianoKeyProps) => {
  const displayNote = note.replace('#', '♯');
  
  return (
    <button
      className={cn(
        "relative select-none touch-manipulation group perspective-1000",
        "transition-all duration-75 ease-out",
        isBlack
          ? cn(
              // Black key - 3D futuristic style
              "h-20 sm:h-24 md:h-28 w-7 sm:w-8 md:w-9 z-10 -mx-[14px] sm:-mx-4 md:-mx-[18px]",
              "rounded-b-md",
              // Multi-layer 3D gradient
              "bg-gradient-to-b from-[hsl(225,25%,18%)] via-[hsl(225,30%,8%)] to-[hsl(225,35%,3%)]",
              // 3D side bevels
              "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:rounded-bl-md",
              "before:bg-gradient-to-b before:from-[hsl(225,20%,22%)] before:via-[hsl(225,25%,12%)] before:to-[hsl(225,35%,5%)]",
              "after:absolute after:inset-y-0 after:right-0 after:w-[3px] after:rounded-br-md",
              "after:bg-gradient-to-b after:from-[hsl(225,20%,20%)] after:via-[hsl(225,25%,10%)] after:to-[hsl(225,35%,4%)]",
              // Shadow for depth
              "shadow-[0_12px_25px_rgba(0,0,0,0.7),0_4px_12px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.05)]",
              isPressed
                ? "translate-y-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_2px_8px_rgba(0,0,0,0.4)] brightness-125"
                : "hover:brightness-110 hover:translate-y-0.5",
              isHighlighted && !isPressed && "ring-2 ring-accent ring-offset-1 ring-offset-background"
            )
          : cn(
              // White key - Ultra luxury 3D style
              "h-28 sm:h-36 md:h-44 w-10 sm:w-11 md:w-13 rounded-b-lg overflow-visible",
              // Ivory gradient with warm tones
              "bg-gradient-to-b from-[hsl(45,60%,98%)] via-[hsl(45,40%,94%)] to-[hsl(40,30%,85%)]",
              // 3D side effects
              "before:absolute before:inset-y-0 before:left-0 before:w-[4px] before:rounded-bl-lg",
              "before:bg-gradient-to-b before:from-[hsl(45,20%,90%)] before:via-[hsl(40,15%,82%)] before:to-[hsl(35,10%,70%)]",
              "after:absolute after:inset-y-0 after:right-0 after:w-[4px] after:rounded-br-lg",
              "after:bg-gradient-to-b after:from-[hsl(45,20%,88%)] after:via-[hsl(40,15%,80%)] after:to-[hsl(35,10%,68%)]",
              // Deep 3D shadow
              "shadow-[0_18px_40px_rgba(0,0,0,0.45),0_6px_16px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.25),inset_0_-4px_10px_rgba(0,0,0,0.08),inset_0_2px_0_rgba(255,255,255,0.9)]",
              isPressed
                ? "translate-y-1 shadow-[0_8px_20px_rgba(0,0,0,0.35),0_3px_8px_rgba(0,0,0,0.25),inset_0_2px_8px_rgba(0,0,0,0.1)] bg-gradient-to-b from-[hsl(45,50%,95%)] via-[hsl(45,35%,90%)] to-[hsl(40,25%,82%)]"
                : "hover:translate-y-0.5 hover:shadow-[0_14px_35px_rgba(0,0,0,0.4),0_5px_14px_rgba(0,0,0,0.3)]",
              isHighlighted && !isPressed && "ring-2 ring-accent ring-offset-2 ring-offset-background"
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
      {/* Top shine reflection for white keys */}
      {!isBlack && (
        <div className={cn(
          "absolute inset-x-1 top-1 h-1/3 rounded-t-md pointer-events-none",
          "bg-gradient-to-b from-white/60 via-white/20 to-transparent",
          isPressed && "opacity-30"
        )} />
      )}
      
      {/* Top shine for black keys */}
      {isBlack && (
        <div className={cn(
          "absolute inset-x-1 top-0 h-1/4 rounded-t pointer-events-none",
          "bg-gradient-to-b from-white/15 to-transparent",
          isPressed && "opacity-0"
        )} />
      )}
      
      {/* Bottom edge detail for white keys */}
      {!isBlack && (
        <div className="absolute inset-x-0 bottom-0 h-2 rounded-b-lg bg-gradient-to-t from-[hsl(35,15%,65%)] to-transparent pointer-events-none" />
      )}
      
      {/* Note label */}
      <span
        className={cn(
          "absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 font-bold pointer-events-none transition-all",
          isBlack 
            ? "text-[9px] sm:text-[10px] text-white/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" 
            : "text-[10px] sm:text-xs text-[hsl(225,20%,35%)] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]",
          isPressed && (isBlack ? "text-white/90" : "text-primary")
        )}
      >
        {displayNote}
      </span>
      
      {/* Octave number for white keys */}
      {!isBlack && (
        <span
          className={cn(
            "absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] font-medium opacity-30 pointer-events-none",
            "text-[hsl(225,15%,40%)]"
          )}
        >
          {octave}
        </span>
      )}
      
      {/* Active glow effect */}
      {isPressed && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-accent/30 rounded-b-lg pointer-events-none" />
          <div className="absolute -inset-1 bg-primary/30 blur-md rounded-lg pointer-events-none animate-pulse" />
        </>
      )}
      
      {/* Highlight indicator for learn mode */}
      {isHighlighted && !isPressed && (
        <div className="absolute -inset-0.5 rounded-lg border-2 border-accent animate-pulse pointer-events-none" />
      )}
    </button>
  );
};



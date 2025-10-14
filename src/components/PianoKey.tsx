import { cn } from "@/lib/utils";

interface PianoKeyProps {
  note: string;
  octave: number;
  isBlack: boolean;
  isPressed: boolean;
  onPress: () => void;
  onRelease: () => void;
  keyboardKey?: string;
}

export const PianoKey = ({
  note,
  octave,
  isBlack,
  isPressed,
  onPress,
  onRelease,
  keyboardKey,
}: PianoKeyProps) => {
  return (
    <button
      className={cn(
        "relative select-none transition-all",
        isBlack
          ? cn(
              "h-32 w-10 z-10 -mx-5 rounded-b-lg",
              "bg-gradient-to-b from-[hsl(var(--black-key))] to-[hsl(var(--black-key-shadow))]",
              "border-2 border-[hsl(var(--black-key-shadow))]",
              isPressed
                ? "translate-y-1 shadow-none brightness-150"
                : "shadow-key hover:brightness-125"
            )
          : cn(
              "h-48 w-14 rounded-b-lg",
              "bg-gradient-to-b from-[hsl(var(--white-key))] via-[hsl(var(--white-key))] to-[hsl(var(--white-key-shadow))]",
              "border-2 border-[hsl(var(--border))]",
              isPressed
                ? "translate-y-1 shadow-none bg-gradient-to-b from-[hsl(var(--key-active))] to-[hsl(var(--primary))]"
                : "shadow-key hover:brightness-95"
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
    >
      {keyboardKey && (
        <span
          className={cn(
            "absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium opacity-40",
            isBlack ? "text-white" : "text-foreground"
          )}
        >
          {keyboardKey}
        </span>
      )}
    </button>
  );
};

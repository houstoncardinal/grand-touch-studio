import { Music, GraduationCap, Settings, Globe, Home, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = 'play' | 'learn' | 'settings' | 'pricing';

interface MobileToolbarProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  onLanguageClick: () => void;
}

export const MobileToolbar = ({ currentMode, onModeChange, onLanguageClick }: MobileToolbarProps) => {
  const items = [
    { mode: 'play' as Mode, icon: Music, label: 'Play' },
    { mode: 'learn' as Mode, icon: GraduationCap, label: 'Learn' },
    { mode: 'pricing' as Mode, icon: Crown, label: 'Premium' },
    { mode: 'settings' as Mode, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-xl" />
      
      {/* Glow line at top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Ambient glow */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-16 bg-primary/20 blur-2xl rounded-full pointer-events-none" />
      
      <nav className="relative flex items-center justify-around px-4 py-3 safe-area-inset-bottom">
        {items.map((item) => {
          const isActive = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => onModeChange(item.mode)}
              className={cn(
                "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active indicator background */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/30" />
              )}
              
              {/* Glow effect for active item */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full blur-sm" />
              )}
              
              <item.icon className={cn(
                "relative w-5 h-5 transition-all duration-300",
                isActive && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
              )} />
              
              <span className={cn(
                "relative text-[10px] font-semibold uppercase tracking-wider transition-all duration-300",
                isActive && "text-primary"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
        
        {/* Language button */}
        <button
          onClick={onLanguageClick}
          className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          <Globe className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Lang</span>
        </button>
      </nav>
    </div>
  );
};

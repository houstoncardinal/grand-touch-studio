import { LANGUAGES, Language } from "@/lib/i18n";
import { Globe, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelector = ({
  currentLanguage,
  onLanguageChange,
  isOpen,
  onClose,
}: LanguageSelectorProps) => {
  const [search, setSearch] = useState('');

  const filteredLanguages = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[80vh] glass-panel rounded-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Select Language</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        
        {/* Languages grid */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  onClose();
                }}
                className={cn(
                  "p-3 rounded-xl text-left transition-all duration-200",
                  currentLanguage === lang.code
                    ? "bg-primary/20 border-2 border-primary/50"
                    : "bg-secondary/30 border border-white/5 hover:bg-secondary/50 hover:border-white/10"
                )}
              >
                <p className="font-semibold text-foreground text-sm">{lang.nativeName}</p>
                <p className="text-xs text-muted-foreground">{lang.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

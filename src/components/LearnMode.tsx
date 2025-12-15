import { useState } from "react";
import { BookOpen, Play, Target, Trophy, ChevronRight, Music2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes: string[];
  completed: boolean;
}

const LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'First Notes',
    description: 'Learn C, D, E - the foundation of piano',
    difficulty: 'beginner',
    notes: ['C', 'D', 'E'],
    completed: false,
  },
  {
    id: '2',
    title: 'Complete Scale',
    description: 'Master the C Major scale',
    difficulty: 'beginner',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'],
    completed: false,
  },
  {
    id: '3',
    title: 'Sharp Notes',
    description: 'Introduction to black keys',
    difficulty: 'intermediate',
    notes: ['C#', 'D#', 'F#', 'G#', 'A#'],
    completed: false,
  },
  {
    id: '4',
    title: 'Simple Melody',
    description: 'Play Twinkle Twinkle Little Star',
    difficulty: 'beginner',
    notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G'],
    completed: false,
  },
  {
    id: '5',
    title: 'Chords Basics',
    description: 'Learn C Major and G Major chords',
    difficulty: 'intermediate',
    notes: ['C', 'E', 'G'],
    completed: false,
  },
  {
    id: '6',
    title: 'Advanced Patterns',
    description: 'Complex finger exercises',
    difficulty: 'advanced',
    notes: ['C', 'E', 'G', 'C', 'B', 'G', 'E', 'C'],
    completed: false,
  },
];

interface LearnModeProps {
  onStartLesson: (notes: string[]) => void;
}

export const LearnMode = ({ onStartLesson }: LearnModeProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const getDifficultyColor = (difficulty: Lesson['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'intermediate': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'advanced': return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
    }
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent to-primary">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Learn Piano</h2>
            <p className="text-sm text-muted-foreground">Step by step lessons</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: BookOpen, label: 'Lessons', value: LESSONS.length },
            { icon: Target, label: 'In Progress', value: 2 },
            { icon: Trophy, label: 'Completed', value: 0 },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl bg-secondary/30 border border-white/5 text-center">
              <stat.icon className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Lessons list */}
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-1">
          {LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className={cn(
                "w-full p-3 rounded-xl border text-left transition-all duration-300 group",
                selectedLesson?.id === lesson.id
                  ? "bg-primary/10 border-primary/40"
                  : "bg-secondary/20 border-white/5 hover:bg-secondary/40 hover:border-white/10"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Music2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{lesson.title}</h3>
                    <p className="text-xs text-muted-foreground">{lesson.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold border",
                    getDifficultyColor(lesson.difficulty)
                  )}>
                    {lesson.difficulty}
                  </span>
                  <ChevronRight className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    selectedLesson?.id === lesson.id && "rotate-90 text-primary"
                  )} />
                </div>
              </div>
              
              {/* Expanded content */}
              {selectedLesson?.id === lesson.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {lesson.notes.map((note, i) => (
                      <span key={i} className="px-2.5 py-1 bg-primary/20 text-primary text-xs font-bold rounded-lg">
                        {note}
                      </span>
                    ))}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartLesson(lesson.notes);
                    }}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Lesson
                  </Button>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const GraduationCap = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

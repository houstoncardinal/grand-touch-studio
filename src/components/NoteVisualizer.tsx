import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
}

interface NoteVisualizerProps {
  activeNotes: string[];
}

const NOTE_COLORS: Record<string, string> = {
  C: "168, 85, 247",   // primary purple
  "C#": "147, 51, 234",
  D: "139, 92, 246",
  "D#": "124, 58, 237",
  E: "99, 102, 241",
  F: "79, 70, 229",
  "F#": "67, 56, 202",
  G: "0, 200, 200",    // accent cyan
  "G#": "6, 182, 212",
  A: "14, 165, 233",
  "A#": "59, 130, 246",
  B: "99, 102, 241",
};

export const NoteVisualizer = ({ activeNotes }: NoteVisualizerProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (activeNotes.length === 0) return;

    const newParticles: Particle[] = activeNotes.flatMap((noteKey) => {
      const note = noteKey.split("-")[0];
      const color = NOTE_COLORS[note] || "168, 85, 247";
      return Array.from({ length: 3 }, () => ({
        id: idRef.current++,
        x: 20 + Math.random() * 60,
        y: 80 + Math.random() * 10,
        size: 4 + Math.random() * 8,
        color,
        velocity: { x: (Math.random() - 0.5) * 2, y: -(1 + Math.random() * 3) },
        life: 1,
      }));
    });

    setParticles((prev) => [...prev.slice(-50), ...newParticles]);
  }, [activeNotes]);

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.life > 0.1).map((p) => ({ ...p, life: p.life - 0.05 })));
    }, 50);
    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 1, x: `${p.x}%`, y: `${p.y}%` }}
            animate={{
              opacity: 0,
              scale: 0.3,
              x: `${p.x + p.velocity.x * 20}%`,
              y: `${p.y + p.velocity.y * 20}%`,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, rgba(${p.color}, 0.8), rgba(${p.color}, 0))`,
              boxShadow: `0 0 ${p.size * 2}px rgba(${p.color}, 0.5)`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

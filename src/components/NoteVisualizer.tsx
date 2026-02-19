import { useEffect, useRef, useCallback } from "react";

interface NoteVisualizerProps {
  activeNotes: string[];
}

const NOTE_COLORS: Record<string, string> = {
  C: "168, 85, 247",
  "C#": "147, 51, 234",
  D: "139, 92, 246",
  "D#": "124, 58, 237",
  E: "99, 102, 241",
  F: "79, 70, 229",
  "F#": "67, 56, 202",
  G: "0, 200, 200",
  "G#": "6, 182, 212",
  A: "14, 165, 233",
  "A#": "59, 130, 246",
  B: "99, 102, 241",
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

export const NoteVisualizer = ({ activeNotes }: NoteVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const prevNotesRef = useRef<string[]>([]);

  const spawnParticles = useCallback((notes: string[]) => {
    const particles = particlesRef.current;
    for (const noteKey of notes) {
      const note = noteKey.split("-")[0];
      const color = NOTE_COLORS[note] || "168, 85, 247";
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: 0.2 + Math.random() * 0.6,
          y: 0.8 + Math.random() * 0.1,
          vx: (Math.random() - 0.5) * 0.02,
          vy: -(0.01 + Math.random() * 0.03),
          size: 4 + Math.random() * 8,
          color,
          life: 1,
        });
      }
    }
    // Cap particles
    if (particles.length > 60) {
      particlesRef.current = particles.slice(-60);
    }
  }, []);

  useEffect(() => {
    // Only spawn for newly added notes
    const prev = new Set(prevNotesRef.current);
    const newNotes = activeNotes.filter(n => !prev.has(n));
    if (newNotes.length > 0) spawnParticles(newNotes);
    prevNotesRef.current = activeNotes;
  }, [activeNotes, spawnParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const px = p.x * w;
        const py = p.y * h;
        const alpha = p.life * 0.8;
        const r = p.size * p.life;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2);
        grad.addColorStop(0, `rgba(${p.color}, ${alpha})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(px, py, r * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

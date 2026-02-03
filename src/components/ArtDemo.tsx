import React, { useRef, useEffect } from "react";
import { GenerativeArt } from "./GenerativeArt";

// Better gradient noise or Perlin would be nicer, but let's stick to a smooth sine field
// mixed with some variation for that "Sol LeWitt" feel of structured chaos.

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: { x: number; y: number }[];
}

export const ArtDemo: React.FC = () => {
  const particles = useRef<Particle[]>([]);
  const initialized = useRef(false);

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          // Reset initialization to force redraw with new colors
          initialized.current = false;
          particles.current = [];
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const count = 400;
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        history: [],
      });
    }
    particles.current = newParticles;
    initialized.current = true;
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _frame: number,
  ) => {
    // Initialize on first frame, resize (detected by empty particles), or theme change
    if (!initialized.current || particles.current.length === 0) {
      initParticles(width, height);
      // Clear background once
      ctx.fillStyle = "#f4f4f5"; // zinc-100 - Sol LeWitt often used white/paper backgrounds
      if (document.documentElement.classList.contains("dark")) {
        ctx.fillStyle = "#18181b";
      }
      ctx.fillRect(0, 0, width, height);
    }

    // Fading trails effect? Or permanent lines?
    // Sol LeWitt is often permanent lines. Let's do permanent lines but very thin.
    // To prevent canvas from becoming solid color, we might reset every N frames or just let it build up.

    // Actually, GenerativeArt clears the canvas implicitly if we don't preserve drawing buffer?
    // Wait, the GenerativeArt component I wrote:
    // "if (animate) ... draw(...) ... "
    // It DOES NOT clear the canvas automatically in the `render` loop I wrote!
    // I commented: "// Clear canvas before drawing for animation, or let the user handle it?"
    // So it accumulates! Perfect for flow fields.

    // But on resize, it clears because canvas dimensions change.

    // Let's draw semi-transparent rect to create trails if we want movement,
    // or just draw lines if we want a static drawing that evolves.
    // Let's do evolving lines.

    // Flow field function
    const getAngle = (x: number, y: number) => {
      const scale = 0.005;
      // Sol LeWitt style: structured grids, arcs, or chaotic lines.
      // Let's do a noisy sine field.
      return (Math.cos(x * scale) + Math.sin(y * scale)) * Math.PI * 2;
    };

    ctx.strokeStyle = "#000000";
    if (document.documentElement.classList.contains("dark")) {
      ctx.strokeStyle = "#ffffff";
    }
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.1;

    particles.current.forEach((p) => {
      const angle = getAngle(p.x, p.y);

      p.vx += Math.cos(angle) * 0.1;
      p.vy += Math.sin(angle) * 0.1;

      // Friction
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Move
      const nextX = p.x + p.vx;
      const nextY = p.y + p.vy;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      p.x = nextX;
      p.y = nextY;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Reset velocity if it gets too high (optional stabilization)
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 2) {
        p.vx *= 0.9;
        p.vy *= 0.9;
      }
    });

    ctx.globalAlpha = 1.0;
  };

  return (
    <GenerativeArt
      animate={true}
      draw={draw}
      className="h-full w-full bg-zinc-100 dark:bg-zinc-900"
    />
  );
};

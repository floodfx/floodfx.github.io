import React, { useRef, useEffect } from 'react';

interface GenerativeArtProps {
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) => void;
  className?: string;
  animate?: boolean;
}

export const GenerativeArt: React.FC<GenerativeArtProps> = ({ draw, className, animate = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);
  const frameCount = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const render = () => {
      if (animate) {
        frameCount.current++;
        // Clear canvas before drawing for animation, or let the user handle it?
        // Usually safer to let user handle it if they want trails, but clearing is standard.
        // Let's assume the user handles clearing or we provide a utility?
        // For a generic component, maybe we don't clear?
        // But if I resize, the canvas is cleared.
        // Let's just pass the context.
        draw(ctx, width, height, frameCount.current);
        animationFrameId.current = requestAnimationFrame(render);
      } else {
        draw(ctx, width, height, 0);
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        width = newWidth;
        height = newHeight;

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.resetTransform(); // Reset any existing transforms
        ctx.scale(dpr, dpr);

        if (!animate) {
           // If not animating, we need to redraw immediately after resize
           draw(ctx, width, height, 0);
        }
      }
    });

    resizeObserver.observe(container);

    if (animate) {
      render();
    }

    return () => {
      resizeObserver.disconnect();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draw, animate]);

  return (
    <div ref={containerRef} className={`w-full h-full min-h-[300px] ${className || ''}`}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

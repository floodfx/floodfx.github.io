import React from 'react';
import { GenerativeArt } from './GenerativeArt';

export const ArtDemo: React.FC = () => {
  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) => {
    // Clear background
    ctx.fillStyle = '#18181b'; // zinc-900
    ctx.fillRect(0, 0, width, height);

    // Draw a nice pattern
    const t = frame * 0.02;
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < 50; i++) {
      const angle = i * 0.5 + t;
      const r = Math.min(width, height) * 0.25 + Math.sin(t * 1.5 + i * 0.1) * 50;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${(i * 15 + frame) % 360}, 70%, 60%)`;
      ctx.fill();
    }

     // Draw text
    ctx.fillStyle = '#a1a1aa'; // zinc-400
    ctx.font = '14px monospace';
    ctx.fillText(`Frame: ${frame}`, 15, 25);
    ctx.fillText(`Size: ${width | 0}x${height | 0}`, 15, 45);
  };

  return (
    <GenerativeArt
      animate={true}
      draw={draw}
      className="w-full h-full"
    />
  );
};

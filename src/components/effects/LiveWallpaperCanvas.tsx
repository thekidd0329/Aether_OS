import React, { useEffect, useRef } from 'react';

interface LiveWallpaperCanvasProps {
  type: 'particles' | 'mesh_gradient' | 'cyber_matrix' | 'aurora' | 'none';
  accentColor: string;
  blur?: number;
  dim?: number;
}

export const LiveWallpaperCanvas: React.FC<LiveWallpaperCanvasProps> = ({
  type,
  accentColor,
  blur = 0,
  dim = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || type === 'none') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Setup particle state
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.2,
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.7 + 0.2,
    }));

    // Setup matrix characters
    const matrixChars = '010101NOVAAX94857392XYZAB⌘∆⚡︎';
    const matrixCols = Math.floor(width / 16);
    const matrixDrops = Array.from({ length: matrixCols }, () => Math.floor(Math.random() * -50));

    let tick = 0;

    const render = () => {
      tick++;

      if (type === 'particles') {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, width, height);

        // Ambient glow
        const grad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.4,
          10,
          width * 0.5,
          height * 0.4,
          width * 0.8
        );
        grad.addColorStop(0, `${accentColor}33`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${accentColor}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        });
      } else if (type === 'cyber_matrix') {
        ctx.fillStyle = 'rgba(5, 7, 12, 0.15)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = accentColor;
        ctx.font = '12px monospace';

        matrixDrops.forEach((y, i) => {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const x = i * 16;
          ctx.fillText(char, x, y * 16);

          if (y * 16 > height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
          }
          matrixDrops[i]++;
        });
      } else if (type === 'mesh_gradient') {
        const time = tick * 0.01;
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, width, height);

        const cx1 = width * (0.5 + 0.3 * Math.sin(time));
        const cy1 = height * (0.4 + 0.25 * Math.cos(time * 0.8));
        const cx2 = width * (0.5 - 0.3 * Math.cos(time * 0.7));
        const cy2 = height * (0.6 + 0.25 * Math.sin(time * 0.9));

        const g1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, width * 0.7);
        g1.addColorStop(0, `${accentColor}88`);
        g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        const g2 = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, width * 0.6);
        g2.addColorStop(0, '#ec489977');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);
      } else if (type === 'aurora') {
        const time = tick * 0.015;
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, width, height);

        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.moveTo(0, height * 0.6);
          for (let x = 0; x <= width; x += 15) {
            const y = height * 0.4 +
              Math.sin(x * 0.01 + time + j) * 60 +
              Math.cos(x * 0.02 - time * 0.8) * 40;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();

          const colors = [`${accentColor}44`, '#06b6d433', '#8b5cf633'];
          ctx.fillStyle = colors[j % colors.length];
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type, accentColor]);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-300"
      style={{
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      {dim > 0 && (
        <div
          className="absolute inset-0 bg-black transition-opacity"
          style={{ opacity: dim / 100 }}
        />
      )}
    </div>
  );
};

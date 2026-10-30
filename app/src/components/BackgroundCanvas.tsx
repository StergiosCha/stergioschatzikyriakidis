import { useEffect, useRef } from 'react';
import { mulberry32 } from '../lib/le-math';
import { usePrefersReducedMotion } from '../hooks/use-reduced-motion';

/** Drifting particle graph behind the page (ported from the LingEmbed hero background).
 *  Colour interpolates amber → cyan across the viewport. Not rendered at all under prefers-reduced-motion;
 *  paused while the tab is hidden. Decorative only. */
export default function BackgroundCanvas() {
  const reducedPref = usePrefersReducedMotion();
  return reducedPref ? null : <Canvas />;
}

function Canvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; const ctx = c?.getContext?.('2d');
    if (!c || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rng = mulberry32(7);
    let W = 0, H = 0, raf = 0, dpr = 1;
    let pts: { x: number; y: number; vx: number; vy: number }[] = [];
    const init = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr;
      const n = Math.round(Math.min(90, innerWidth / 16));
      pts = Array.from({ length: n }, () => ({ x: rng() * W, y: rng() * H, vx: (rng() - .5) * .25, vy: (rng() - .5) * .25 }));
    };
    const col = (x: number, a: number) => { const t = Math.max(0, Math.min(1, x / W)); return `rgba(${Math.round(245 * (1 - t) + 56 * t)},${Math.round(185 * (1 - t) + 217 * t)},${Math.round(66 * (1 - t) + 245 * t)},${a})`; };
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      const R = 140 * dpr;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < R) { ctx.strokeStyle = col((p.x + q.x) / 2, 0.22 * (1 - d / R)); ctx.lineWidth = dpr; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        ctx.fillStyle = col(p.x, 0.7); ctx.beginPath(); ctx.arc(p.x, p.y, 1.8 * dpr, 0, 7); ctx.fill();
      }
      if (!reduce && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) frame(); };
    const onResize = () => { init(); if (reduce) frame(); };
    init(); frame();
    addEventListener('resize', onResize); document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis); };
  }, []);
  return <canvas id="bg-canvas" ref={ref} aria-hidden="true" />;
}

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";

interface DotGridProps {
  className?: string;
  /** Distance between dots in CSS px. */
  gap?: number;
  /** Resting dot radius in CSS px. */
  dotRadius?: number;
  /** Radius (CSS px) around the pointer within which dots react. */
  proximity?: number;
}

interface Dot {
  x: number;
  y: number;
}

const BASE_RGB = [15, 76, 58] as const; // --color-primary
const GLOW_RGB = [122, 185, 76] as const; // --color-accent
const BASE_ALPHA = 0.14;
const GLOW_ALPHA = 0.7;
const MAX_PUSH = 7;
const MAX_GROW = 2.4;

/**
 * Pointer-reactive dot field (React Bits `DotGrid` style) drawn on a 2D canvas.
 * Fills its positioned parent and tracks the pointer at window level, so the
 * effect keeps working while the cursor is over foreground content or when
 * the canvas sits inside a `pointer-events-none` wrapper.
 *
 * Desktop: dots near the cursor bloom, brighten, and drift outward; the render
 * loop only runs while something is still moving and the canvas is on screen.
 * Mobile: a static CSS pattern is visible before JavaScript loads.
 */
export function DotGrid({
  className,
  gap = 26,
  dotRadius = 1.3,
  proximity = 170,
}: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const interactive = isDesktop;

  useEffect(() => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let raf = 0;
    let running = false;
    let onScreen = true;

    // Smoothed pointer state. `strength` eases in on enter and out on leave so
    // the bloom fades in place instead of sliding off-screen.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0 };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const [br, bg, bb] = BASE_RGB;
      const [gr, gg, gb] = GLOW_RGB;
      const strength = pointer.strength;
      const prox2 = proximity * proximity;

      for (const dot of dots) {
        let radius = dotRadius;
        let alpha = BASE_ALPHA;
        let ox = 0;
        let oy = 0;
        let r = br;
        let g = bg;
        let b = bb;

        if (strength > 0.001) {
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < prox2) {
            const dist = Math.sqrt(dist2) || 1;
            const t = 1 - dist / proximity;
            const ease = t * t * (3 - 2 * t) * strength;
            radius = dotRadius + ease * MAX_GROW;
            alpha = BASE_ALPHA + ease * (GLOW_ALPHA - BASE_ALPHA);
            ox = (dx / dist) * ease * MAX_PUSH;
            oy = (dy / dist) * ease * MAX_PUSH;
            r = br + (gr - br) * ease;
            g = bg + (gg - bg) * ease;
            b = bb + (gb - bb) * ease;
          }
        }

        ctx.beginPath();
        ctx.arc(dot.x + ox, dot.y + oy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
        ctx.fill();
      }
    };

    const tick = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;
      pointer.strength += (pointer.target - pointer.strength) * 0.12;
      draw();

      const settled =
        Math.abs(pointer.tx - pointer.x) < 0.05 &&
        Math.abs(pointer.ty - pointer.y) < 0.05 &&
        Math.abs(pointer.target - pointer.strength) < 0.003;

      if (settled || !onScreen) {
        pointer.strength = pointer.target;
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !onScreen) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      running = false;
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const offsetX = (width - (cols - 1) * gap) / 2;
      const offsetY = (height - (rows - 1) * gap) / 2;
      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({ x: offsetX + col * gap, y: offsetY + row * gap });
        }
      }
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (!inside) {
        if (pointer.target !== 0) {
          pointer.target = 0;
          start();
        }
        return;
      }
      pointer.tx = x;
      pointer.ty = y;
      if (pointer.target === 0) {
        // First contact: snap the smoothed position so the bloom doesn't fly in.
        pointer.x = x;
        pointer.y = y;
      }
      pointer.target = 1;
      start();
    };
    const onPointerLeave = () => {
      pointer.target = 0;
      start();
    };

    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      if (!onScreen) stop();
      else if (pointer.target > 0) start();
    });
    intersection.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const root = document.documentElement;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [interactive, gap, dotRadius, proximity]);

  return (
    <>
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 lg:hidden", className)}
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${BASE_RGB.join(",")},${BASE_ALPHA}) ${dotRadius}px, transparent ${dotRadius}px)`,
          backgroundSize: `${gap}px ${gap}px`,
          backgroundPosition: "center",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 hidden lg:block", className)}
      />
    </>
  );
}

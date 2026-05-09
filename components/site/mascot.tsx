"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

interface MascotProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

interface Sparkle {
  id: number;
  angle: number;
  startDistance: number;
  endDistance: number;
  scale: number;
}

const SPARKLE_COUNT = 6;
const SPARKLE_LIFE = 900;

export function Mascot({ className, size = 360, priority: _priority = false }: MascotProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const idCounter = useRef(0);

  const playWink = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const handleClick = () => {
    playWink();
    if (reduceMotion) return;
    const baseAngle = Math.random() * 360;
    const startRadius = size * 0.5;
    const newOnes: Sparkle[] = Array.from({ length: SPARKLE_COUNT }, () => {
      const id = idCounter.current++;
      return {
        id,
        angle: baseAngle + (360 / SPARKLE_COUNT) * id + (Math.random() * 30 - 15),
        startDistance: startRadius,
        endDistance: startRadius + size * 0.18 + Math.random() * (size * 0.1),
        scale: 0.9 + Math.random() * 0.6,
      };
    });
    setSparkles((prev) => [...prev, ...newOnes]);
    window.setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newOnes.find((n) => n.id === s.id)));
    }, SPARKLE_LIFE);
  };

  return (
    <motion.div
      className={cn("group relative shrink-0", className)}
      style={{ width: size, height: size }}
      animate={
        reduceMotion ? { scale: 1 } : { scale: [1, 1.06, 1] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {/* Idle halo — always pulses softly */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[var(--color-primary)] blur-3xl"
        initial={{ opacity: 0.06, scale: 1 }}
        animate={
          reduceMotion
            ? { opacity: 0.06, scale: 1 }
            : { opacity: [0.04, 0.14, 0.04], scale: [1, 1.32, 1] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
        }
      />
      {/* Hover halo — gentle bloom on top */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-0 blur-2xl",
          "transition-[opacity,transform] duration-500 ease-out",
          "group-hover:scale-[1.18] group-hover:opacity-[0.16]",
          "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
        )}
      />
      <button
        type="button"
        onClick={handleClick}
        aria-label="마스코트에게 인사하기"
        className={cn(
          "relative block h-full w-full cursor-pointer overflow-hidden rounded-full bg-white",
          "shadow-[0_24px_60px_-20px_rgba(15,76,58,0.25)]",
          "ring-1 ring-[var(--color-border)]",
          "transition-transform duration-200 ease-out",
          "hover:scale-[1.03]",
          "active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
          "motion-reduce:transition-none motion-reduce:hover:scale-100",
        )}
      >
        <video
          ref={videoRef}
          poster="/firstfluke-mascot-poster.jpg"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-label="FIRST FLUKE 마스코트 (수달)"
          className="h-full w-full object-cover"
        >
          <source src="/firstfluke-mascot-wink.webm" type="video/webm" />
          <source src="/firstfluke-mascot-wink.mp4" type="video/mp4" />
        </video>
      </button>

      <AnimatePresence>
        {sparkles.map((sparkle) => {
          const rad = (sparkle.angle * Math.PI) / 180;
          const startX = Math.cos(rad) * sparkle.startDistance;
          const startY = Math.sin(rad) * sparkle.startDistance;
          const endX = Math.cos(rad) * sparkle.endDistance;
          const endY = Math.sin(rad) * sparkle.endDistance;
          return (
            <motion.span
              key={sparkle.id}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 select-none"
              style={{ fontSize: Math.max(18, size * 0.09) }}
              initial={{ x: startX, y: startY, scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                x: endX,
                y: endY,
                scale: [0, sparkle.scale, 0],
                opacity: [0, 1, 0],
                rotate: (Math.random() - 0.5) * 60,
              }}
              transition={{ duration: SPARKLE_LIFE / 1000, ease: "easeOut" }}
            >
              🍀
            </motion.span>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

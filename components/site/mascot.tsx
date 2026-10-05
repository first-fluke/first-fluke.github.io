"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";
import { useI18n } from "@/lib/i18n/use-i18n";

interface MascotProps {
  className?: string;
  size?: number;
  media?: string;
  autoPlay?: boolean;
  cover: string;
}

interface Sparkle {
  id: number;
  angle: number;
  startDistance: number;
  endDistance: number;
  scale: number;
  rotate: number;
}

const SPARKLE_COUNT = 6;
const SPARKLE_LIFE = 900;

export function Mascot({ className, size = 360, media, autoPlay = true, cover }: MascotProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useI18n();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const idleLoops = isDesktop;
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [hasPlayed, setHasPlayed] = useState(false);
  const idCounter = useRef(0);

  useEffect(() => {
    if (!media) return;
    const query = window.matchMedia(media);
    const syncPlayback = () => {
      const video = videoRef.current;
      if (!video) return;
      if (!query.matches) {
        video.pause();
      } else if (!video.currentSrc) {
        // Source media is evaluated when loading; reselect on viewport changes.
        video.load();
        if (autoPlay) video.play().catch(() => {});
      }
    };
    query.addEventListener("change", syncPlayback);
    return () => query.removeEventListener("change", syncPlayback);
  }, [media, autoPlay]);

  const playWink = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasPlayed(true);
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const handleClick = () => {
    playWink();
    const baseAngle = Math.random() * 360;
    const startRadius = size * 0.5;
    const newOnes: Sparkle[] = Array.from({ length: SPARKLE_COUNT }, () => {
      const id = idCounter.current++;
      return {
        id,
        angle:
          baseAngle + (360 / SPARKLE_COUNT) * id + (Math.random() * 30 - 15),
        startDistance: startRadius,
        endDistance: startRadius + size * 0.18 + Math.random() * (size * 0.1),
        scale: 0.9 + Math.random() * 0.6,
        rotate: (Math.random() - 0.5) * 60,
      };
    });
    setSparkles((prev) => [...prev, ...newOnes]);
    window.setTimeout(() => {
      setSparkles((prev) =>
        prev.filter((s) => !newOnes.find((n) => n.id === s.id)),
      );
    }, SPARKLE_LIFE);
  };

  return (
    <motion.div
      className={cn("group relative shrink-0", className)}
      style={{ width: size, height: size }}
      animate={idleLoops ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={
        idleLoops
          ? { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0 }
      }
    >
      {/* Idle halo — pulses softly on desktop, static on mobile */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[var(--color-primary)] blur-3xl"
        initial={{ opacity: 0.06, scale: 1 }}
        animate={
          idleLoops
            ? { opacity: [0.04, 0.14, 0.04], scale: [1, 1.32, 1] }
            : { opacity: 0.06, scale: 1 }
        }
        transition={
          idleLoops
            ? { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      />
      {/* Hover halo — gentle bloom on top */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-0 blur-2xl",
          "transition-[opacity,transform] duration-500 ease-out",
          "group-hover:scale-[1.18] group-hover:opacity-[0.16]",
        )}
      />
      <button
        type="button"
        onClick={handleClick}
        aria-label={t.hero.mascotButtonAria}
        className={cn(
          "relative block h-full w-full cursor-pointer overflow-hidden rounded-full bg-white",
          "shadow-[0_24px_60px_-20px_rgba(15,76,58,0.25)]",
          "ring-1 ring-[var(--color-border)]",
          "transition-transform duration-200 ease-out",
          "hover:scale-[1.03]",
          "active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
        )}
      >
        {!autoPlay && !hasPlayed && (
          <Image
            src={cover}
            alt=""
            fill
            unoptimized
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="object-cover"
          />
        )}
        <video
          ref={videoRef}
          poster={cover}
          autoPlay={autoPlay}
          muted
          playsInline
          preload={autoPlay ? "auto" : "none"}
          aria-label={t.hero.mascotVideoAria}
          className={cn("h-full w-full object-cover", !autoPlay && !hasPlayed && "hidden")}
        >
          <source src="/firstfluke-mascot-wink.webm" type="video/webm" media={media} />
          <source src="/firstfluke-mascot-wink.mp4" type="video/mp4" media={media} />
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
              initial={{
                x: startX,
                y: startY,
                scale: 0,
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                x: endX,
                y: endY,
                scale: [0, sparkle.scale, 0],
                opacity: [0, 1, 0],
                rotate: sparkle.rotate,
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

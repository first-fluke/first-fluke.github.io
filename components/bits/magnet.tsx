"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionValue, useSpring } from "motion/react";
import * as motion from "motion/react-m";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";

interface MagnetProps {
  children: ReactNode;
  className?: string;
  /** How far (0–1) the element follows the pointer offset. */
  strength?: number;
  /** Extra reach (CSS px) beyond the element's own bounds. */
  padding?: number;
}

const MAGNET_SPRING = { stiffness: 240, damping: 20, mass: 0.5 };

/**
 * Pulls its child toward a nearby pointer and springs back on exit
 * (React Bits `Magnet` style). Desktop pointer only; inert on touch.
 */
export function Magnet({
  children,
  className,
  strength = 0.32,
  padding = 80,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const active = isDesktop;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNET_SPRING);
  const springY = useSpring(y, MAGNET_SPRING);

  useEffect(() => {
    if (!active) return;

    const onPointerMove = (event: PointerEvent) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const inside =
        Math.abs(dx) < rect.width / 2 + padding &&
        Math.abs(dy) < rect.height / 2 + padding;
      x.set(inside ? dx * strength : 0);
      y.set(inside ? dy * strength : 0);
    };
    const reset = () => {
      x.set(0);
      y.set(0);
    };

    const root = document.documentElement;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [active, padding, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      className={cn("flex", className)}
      style={active ? { x: springX, y: springY } : undefined}
    >
      {children}
    </motion.div>
  );
}

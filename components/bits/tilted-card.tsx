"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { useMotionValue, useSpring } from "motion/react";
import * as motion from "motion/react-m";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees on each axis. */
  maxTilt?: number;
  /** Scale while hovered. */
  hoverScale?: number;
}

const TILT_SPRING = { stiffness: 260, damping: 24, mass: 0.6 };

/**
 * 3D tilt-toward-pointer wrapper (React Bits `TiltedCard` style).
 * Desktop pointer only; a plain wrapper on touch and under reduced motion.
 */
export function TiltedCard({
  children,
  className,
  maxTilt = 7,
  hoverScale = 1.015,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const active = isDesktop;

  const rotateX = useSpring(useMotionValue(0), TILT_SPRING);
  const rotateY = useSpring(useMotionValue(0), TILT_SPRING);
  const scale = useSpring(useMotionValue(1), TILT_SPRING);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || !active) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 2 * maxTilt);
    rotateX.set(-py * 2 * maxTilt);
    scale.set(hoverScale);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      className={cn("[perspective:1200px]", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        ref={ref}
        style={
          active
            ? { rotateX, rotateY, scale, transformStyle: "preserve-3d" }
            : undefined
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

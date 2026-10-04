"use client";

import { useRef, type ReactNode } from "react";
import { useScroll, useTransform } from "motion/react";
import * as motion from "motion/react-m";
import { useMediaQuery } from "@/lib/use-media-query";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Vertical travel in CSS px while the element crosses the viewport.
   * Positive values drift up as you scroll down (faster than the page);
   * negative values lag behind.
   */
  offset?: number;
}

/**
 * Scroll-linked vertical drift, desktop only. Wraps any block so sibling
 * columns can move at different rates for a layered feel.
 */
export function Parallax({ children, className, offset = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const active = isDesktop;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={active ? { y } : undefined}
    >
      {children}
    </motion.div>
  );
}

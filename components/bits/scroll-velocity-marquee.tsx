"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import * as motion from "motion/react-m";
import { cn } from "@/lib/cn";

interface ScrollVelocityMarqueeProps {
  /** One repeat unit of the ticker (rendered several times to fill the row). */
  children: ReactNode;
  className?: string;
  /** Idle speed in CSS px per second. Negative scrolls right-to-left reversed. */
  baseVelocity?: number;
  /** How many copies of `children` to lay out. */
  copies?: number;
}

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/**
 * Infinite horizontal ticker that speeds up and flips direction with scroll
 * velocity (React Bits `ScrollVelocity` style). Decorative: hidden from
 * assistive tech.
 */
export function ScrollVelocityMarquee({
  children,
  className,
  baseVelocity = 40,
  copies = 6,
}: ScrollVelocityMarqueeProps) {
  const copyRef = useRef<HTMLDivElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], {
    clamp: false,
  });
  const direction = useRef(1);

  useEffect(() => {
    const node = copyRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setCopyWidth(entry.contentRect.width);
    });
    observer.observe(node);
    setCopyWidth(node.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const x = useTransform(baseX, (value) =>
    copyWidth > 0 ? `${wrap(-copyWidth, 0, value)}px` : "0px",
  );

  useAnimationFrame((_, delta) => {
    if (copyWidth === 0) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += moveBy * Math.abs(factor);
    baseX.set(baseX.get() - moveBy);
  });

  return (
    <div
      aria-hidden
      className={cn("overflow-hidden whitespace-nowrap", className)}
    >
      <motion.div className="flex w-max" style={{ x }}>
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? copyRef : undefined}
            className="flex shrink-0 items-center"
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

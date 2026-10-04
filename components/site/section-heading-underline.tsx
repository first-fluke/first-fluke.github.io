"use client";

import * as motion from "motion/react-m";
import { cn } from "@/lib/cn";

interface SectionHeadingUnderlineProps {
  className?: string;
}

export function SectionHeadingUnderline({
  className,
}: SectionHeadingUnderlineProps) {
  return (
    <motion.div
      aria-hidden
      style={{ transformOrigin: "0% 50%" }}
      className={cn(
        "mt-4 h-[3px] w-16 rounded-full bg-[var(--color-primary)]",
        className,
      )}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.35,
      }}
    />
  );
}

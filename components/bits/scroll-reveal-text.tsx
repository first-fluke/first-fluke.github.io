"use client";

import { lazy, Suspense } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

const ScrollRevealAnimated = lazy(() => import("@/components/bits/scroll-reveal-animated")
  .then((module) => ({ default: module.ScrollRevealAnimated })));

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export function ScrollRevealText({ text, className }: ScrollRevealTextProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const paragraph = <p className={className}>{text}</p>;
  if (!isDesktop || reducedMotion) return paragraph;
  return (
    <Suspense fallback={paragraph}>
      <ScrollRevealAnimated text={text} className={className} />
    </Suspense>
  );
}

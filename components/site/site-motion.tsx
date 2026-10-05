"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => new Promise<typeof import("@/lib/motion-features").default>((resolve, reject) => {
  // Hydration effects can run before the browser paints the server HTML.
  // Give that HTML a frame before initializing animation features.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    import("@/lib/motion-features").then((module) => resolve(module.default), reject);
  }));
});

export function SiteMotion({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}

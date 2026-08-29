"use client";

import { ScrollVelocityMarquee } from "@/components/bits/scroll-velocity-marquee";
import { SOLUTIONS } from "@/lib/solutions";
import { useI18n } from "@/lib/i18n/use-i18n";

/**
 * Product ticker between the hero and About: the tagline plus every live
 * product name, scrolling continuously and accelerating with page scroll.
 */
export function BrandMarquee() {
  const { t } = useI18n();
  const labels = [
    "MAKE YOUR FIRST WIN",
    ...SOLUTIONS.map(
      (solution) => t.solutions.items[solution.id]?.name ?? solution.name,
    ),
  ];

  return (
    <div className="relative bg-[var(--color-primary)] text-white">
      <ScrollVelocityMarquee className="py-3.5 md:py-4">
        {labels.map((label, i) => (
          <span key={i} className="flex items-center">
            <span className="px-5 text-[13px] font-semibold uppercase tracking-[0.16em] md:px-7 md:text-sm">
              {label}
            </span>
            <span aria-hidden className="text-[var(--color-accent)]">
              ✦
            </span>
          </span>
        ))}
      </ScrollVelocityMarquee>
    </div>
  );
}

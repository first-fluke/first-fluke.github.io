"use client";

import { motion, useReducedMotion } from "motion/react";
import { SolutionCard } from "@/components/site/solution-card";
import { SectionHeadingUnderline } from "@/components/site/section-heading-underline";
import { SOLUTIONS } from "@/lib/solutions";
import { useMediaQuery } from "@/lib/use-media-query";
import { useI18n } from "@/lib/i18n/use-i18n";

const BRAKE_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 22,
  mass: 1.1,
};

export function SolutionsGrid() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const container = {
    hidden: {},
    show: reduceMotion
      ? { transition: { staggerChildren: 0 } }
      : { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };

  const heading = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
        },
  };

  const card = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : isDesktop
        ? { opacity: 0, x: -160 }
        : { opacity: 0, x: -64 },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : { opacity: 1, x: 0, transition: BRAKE_SPRING },
  };

  return (
    <section id="solutions" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={heading} className="mb-12 max-w-2xl md:mb-16">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm">
              Solution
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-primary)] md:text-4xl">
              {t.solutions.heading}
            </h2>
            <SectionHeadingUnderline />
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SOLUTIONS.map((solution) => (
              <motion.div key={solution.id} variants={card}>
                <SolutionCard solution={solution} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

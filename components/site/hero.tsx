"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LinkButton } from "@/components/ui/button";
import { Mascot } from "@/components/site/mascot";
import { SelectionBadge } from "@/components/site/selection-badge";
import { useMediaQuery } from "@/lib/use-media-query";

const BRAKE_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 22,
  mass: 1.1,
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { scrollY } = useScroll();
  const mascotParallaxY = useTransform(scrollY, [0, 800], [0, 60]);
  const textParallaxY = useTransform(scrollY, [0, 800], [0, 30]);

  const container = {
    hidden: {},
    show: reduceMotion
      ? { transition: { staggerChildren: 0 } }
      : { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };

  const itemFromLeft = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : isDesktop
        ? { opacity: 0, x: -240 }
        : { opacity: 0, x: -80 },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : { opacity: 1, x: 0, y: 0, transition: BRAKE_SPRING },
  };

  const itemFromRight = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : isDesktop
        ? { opacity: 0, x: 80, scale: 1.06 }
        : { opacity: 0, y: 24, scale: 1.04 },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : { opacity: 1, x: 0, y: 0, scale: 1, transition: BRAKE_SPRING },
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24 lg:min-h-screen lg:flex lg:items-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 78% 32%, rgba(122,185,76,0.07) 0%, transparent 55%)",
        }}
      />
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <motion.div
          className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="flex flex-col gap-6 text-center lg:text-left"
            style={reduceMotion || !isDesktop ? undefined : { y: textParallaxY }}
          >
            <motion.div
              variants={itemFromLeft}
              className="flex justify-center lg:hidden"
            >
              <SelectionBadge variant="chip" />
            </motion.div>

            <motion.p
              variants={itemFromLeft}
              className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm"
            >
              MAKE YOUR FIRST WIN
            </motion.p>

            <motion.h1
              variants={itemFromLeft}
              className="text-4xl font-bold leading-[1.28] text-[var(--color-primary)] md:text-5xl lg:text-[64px] lg:leading-[1.22]"
            >
              당신을 첫 번째
              <br />
              행운으로 이끕니다
            </motion.h1>

            <motion.div
              variants={itemFromRight}
              className="flex justify-center lg:hidden"
            >
              <Mascot size={220} />
            </motion.div>

            <motion.p
              variants={itemFromLeft}
              className="text-base text-[var(--color-fg-muted)] md:text-lg"
            >
              AI와 기술로 더 나은 일상을 만드는 팀,{" "}
              <span className="whitespace-nowrap">FIRST FLUKE.</span>
            </motion.p>

            <motion.div
              variants={itemFromLeft}
              className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <LinkButton href="#solutions" size="lg">
                솔루션 보기
              </LinkButton>
              <LinkButton href="#contact" size="lg" variant="secondary">
                문의하기
              </LinkButton>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemFromRight}
            className="hidden justify-end lg:flex"
          >
            <motion.div style={reduceMotion || !isDesktop ? undefined : { y: mascotParallaxY }}>
              <Mascot size={420} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

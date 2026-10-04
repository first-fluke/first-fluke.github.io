"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { DotGrid } from "@/components/bits/dot-grid";
import { Magnet } from "@/components/bits/magnet";
import { ShinyText } from "@/components/bits/shiny-text";
import { SplitText } from "@/components/bits/split-text";
import { LinkButton } from "@/components/ui/button";
import { Mascot } from "@/components/site/mascot";
import { SelectionBadge } from "@/components/site/selection-badge";
import { useMediaQuery } from "@/lib/use-media-query";
import { useI18n } from "@/lib/i18n/use-i18n";

const BRAKE_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 22,
  mass: 1.1,
};

/** Delay before the headline glyphs start (seconds). */
const TITLE_DELAY = 0.12;
/** Elements below the headline wait for most of the glyph reveal. */
const AFTER_TITLE_DELAY = 0.5;

export function Hero({ mascotCover }: { mascotCover: string }) {
  const { t, locale } = useI18n();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const heavyEffects = isDesktop;

  const { scrollY } = useScroll();
  const textParallaxY = useTransform(scrollY, [0, 800], [0, 40]);
  const mascotParallaxY = useTransform(scrollY, [0, 800], [0, 100]);
  const mascotRotate = useTransform(scrollY, [0, 800], [0, -6]);
  const contentOpacity = useTransform(scrollY, [0, 560], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 640], [1, 0.94]);
  const hintOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };

  const itemFromLeft = {
    hidden: isDesktop ? { opacity: 0, x: -240 } : { opacity: 0, x: -80 },
    show: { opacity: 1, x: 0, y: 0, transition: BRAKE_SPRING },
  };

  const itemFromLeftAfterTitle = {
    hidden: itemFromLeft.hidden,
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { ...BRAKE_SPRING, delay: AFTER_TITLE_DELAY },
    },
  };

  const itemFromRight = {
    hidden: isDesktop
      ? { opacity: 0, x: 80, scale: 1.06 }
      : { opacity: 0, y: 24, scale: 1.04 },
    show: { opacity: 1, x: 0, y: 0, scale: 1, transition: BRAKE_SPRING },
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24 lg:min-h-screen lg:flex lg:items-center"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_75%_at_50%_45%,black_20%,transparent_100%)]">
          <DotGrid />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 78% 32%, rgba(122,185,76,0.09) 0%, transparent 55%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <motion.div
          className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
          variants={container}
          initial={false}
          animate="show"
          style={
            heavyEffects
              ? { opacity: contentOpacity, scale: contentScale }
              : undefined
          }
        >
          <motion.div
            className="flex flex-col gap-6 text-center lg:text-left"
            style={heavyEffects ? { y: textParallaxY } : undefined}
          >
            <motion.div
              variants={itemFromLeft}
              className="flex justify-center lg:hidden"
            >
              <SelectionBadge variant="chip" />
            </motion.div>

            <motion.p
              variants={itemFromLeft}
              className="text-[13px] font-semibold uppercase tracking-[0.18em] md:text-sm"
            >
              <ShinyText>MAKE YOUR FIRST WIN</ShinyText>
            </motion.p>

            <h1 className="text-4xl font-bold leading-[1.28] text-[var(--color-primary)] md:text-5xl lg:text-[64px] lg:leading-[1.22]">
              <SplitText
                key={locale}
                text={`${t.hero.titleLine1}\n${t.hero.titleLine2}`}
                delay={TITLE_DELAY}
              />
            </h1>

            <motion.div
              variants={itemFromRight}
              className="flex justify-center lg:hidden"
            >
              <Mascot size={220} media="(max-width: 1023px)" autoPlay={false} cover={mascotCover} />
            </motion.div>

            <motion.p
              variants={itemFromLeftAfterTitle}
              className="text-base text-[var(--color-fg-muted)] md:text-lg"
            >
              {t.hero.subtitleLead}{" "}
              <span className="whitespace-nowrap">FIRST FLUKE.</span>
            </motion.p>

            <motion.div
              variants={itemFromLeftAfterTitle}
              className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Magnet>
                <LinkButton
                  href="#solutions"
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  {t.hero.ctaSolutions}
                </LinkButton>
              </Magnet>
              <Magnet>
                <LinkButton
                  href="#contact"
                  size="lg"
                  variant="secondary"
                  className="flex-1 sm:flex-none"
                >
                  {t.hero.ctaContact}
                </LinkButton>
              </Magnet>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemFromRight}
            className="hidden justify-end lg:flex"
          >
            <motion.div
              style={
                heavyEffects
                  ? { y: mascotParallaxY, rotate: mascotRotate }
                  : undefined
              }
            >
              <Mascot size={420} media="(min-width: 1024px)" cover={mascotCover} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint — desktop only, fades as soon as scrolling starts */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block">
        <motion.div style={heavyEffects ? { opacity: hintOpacity } : undefined}>
          <motion.a
            href="#about"
            aria-label={t.hero.scrollHintAria}
            className="flex flex-col items-center gap-2 rounded-full text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-primary)]"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <span className="flex h-9 w-[22px] items-start justify-center rounded-full border border-current/40 p-[3px]">
              <motion.span
                aria-hidden
                className="block h-1.5 w-1.5 rounded-full bg-current"
                animate={{ y: [0, 12, 0], opacity: [1, 0.25, 1] }}
                transition={{
                  duration: 1.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              Scroll
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

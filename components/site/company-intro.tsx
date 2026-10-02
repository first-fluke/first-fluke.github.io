"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ScrollRevealText } from "@/components/bits/scroll-reveal-text";
import { SectionHeadingUnderline } from "@/components/site/section-heading-underline";
import { useMediaQuery } from "@/lib/use-media-query";
import { useI18n } from "@/lib/i18n/use-i18n";

const PARAGRAPH_CLASSES = [
  "font-medium",
  "",
  "",
  "pt-2 font-medium text-[var(--color-primary)]",
];

export function CompanyIntro() {
  const { t } = useI18n();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const cloverY = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const heavyEffects = isDesktop;

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-white py-20 md:py-32 lg:py-44"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 -bottom-24 select-none md:-right-24 md:-bottom-32"
        style={heavyEffects ? { y: cloverY } : undefined}
      >
        <Image
          src="/logo.png"
          alt=""
          width={720}
          height={720}
          unoptimized
          className="h-[360px] w-[360px] opacity-[0.09] lg:animate-[spin_120s_linear_infinite] md:h-[640px] md:w-[640px]"
        />
      </motion.div>
      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(220px,1fr)_minmax(560px,2.5fr)] lg:gap-20">
          <motion.div
            variants={item}
            initial={false}
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="lg:self-start"
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm">
              About Us
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--color-primary)] md:text-3xl lg:text-4xl">
              FIRST FLUKE
            </h2>
            <SectionHeadingUnderline />
          </motion.div>

          <div className="min-w-0 space-y-7 break-keep text-[17px] leading-[1.75] text-[var(--color-fg)] md:space-y-9 md:text-lg md:leading-[1.75] lg:space-y-10 lg:text-xl lg:leading-[1.8] [&:lang(ja)]:break-normal">
            {t.about.paragraphs.map((text, i) => (
              <ScrollRevealText
                key={`${i}-${text}`}
                text={text}
                className={PARAGRAPH_CLASSES[i]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

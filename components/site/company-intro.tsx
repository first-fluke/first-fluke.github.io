"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SectionHeadingUnderline } from "@/components/site/section-heading-underline";
import { useMediaQuery } from "@/lib/use-media-query";

const PARAGRAPHS = [
  {
    className: "font-medium",
    text: "AI와 기술로 더 나은 일상을 만드는 팀입니다.",
  },
  {
    className: "",
    text: "퍼스트플루크는 기능을 많이 담는 서비스보다, 사람들이 오래 쓰는 경험을 고민합니다. 복잡한 기술을 전면에 드러내는 대신, 사용자가 편하게 이해하고 쓸 수 있도록 구조와 흐름을 설계합니다.",
  },
  {
    className: "",
    text: "AI, 콘텐츠, 자동화를 기반으로 다양한 디지털 제품과 서비스를 기획하고 개발합니다. 아이디어 단계부터 실제 사용까지 이어지는, 실행 중심의 프로덕트를 만듭니다.",
  },
  {
    className: "pt-2 font-medium text-[var(--color-primary)]",
    text: "기술 자체보다 ‘왜 필요한가’와 ‘어떤 경험을 남기는가’를 먼저 생각합니다.",
  },
];

export function CompanyIntro() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const cloverY = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const heavyEffects = isDesktop && !reduceMotion;

  const container = {
    hidden: {},
    show: reduceMotion
      ? { transition: { staggerChildren: 0 } }
      : { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const item = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : {
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
          className="h-[360px] w-[360px] opacity-[0.09] lg:motion-safe:animate-[spin_120s_linear_infinite] md:h-[640px] md:w-[640px]"
        />
      </motion.div>
      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-12">
        <motion.div
          className="grid gap-10 lg:grid-cols-[minmax(220px,1fr)_minmax(560px,2.5fr)] lg:gap-20"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={item}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm">
              About Us
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--color-primary)] md:text-3xl lg:text-4xl">
              FIRST FLUKE
            </h2>
            <SectionHeadingUnderline />
          </motion.div>

          <div className="space-y-7 break-keep text-[17px] leading-[1.75] text-[var(--color-fg)] md:space-y-9 md:text-lg md:leading-[1.75] lg:space-y-10 lg:text-xl lg:leading-[1.8]">
            {PARAGRAPHS.map((p, i) => (
              <motion.p key={i} variants={item} className={p.className}>
                {p.text}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

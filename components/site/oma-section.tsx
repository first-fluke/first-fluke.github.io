"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { LinkButton } from "@/components/ui/button";
import { SectionHeadingUnderline } from "@/components/site/section-heading-underline";
import { TypewriterText } from "@/components/site/typewriter-text";
import { OMA_DOCS_URL, OMA_REPO_URL } from "@/lib/oma-content";
import { useMediaQuery } from "@/lib/use-media-query";

const AGENTS = [
  { tag: "기획자", desc: "어떤 화면이 필요한지 정리" },
  { tag: "프론트엔드", desc: "UI · 컴포넌트 설계" },
  { tag: "백엔드", desc: "데이터 · API 연결" },
  { tag: "QA 리뷰어", desc: "테스트 · 검수" },
];

const HIGHLIGHTS = [
  { label: "Portable", desc: "IDE에 묶이지 않음" },
  { label: "Role-based", desc: "프롬프트 묶음이 아닌 팀 구조" },
  { label: "Multi-vendor", desc: "Claude · Codex · Gemini · Qwen 혼합" },
  { label: "Token-efficient", desc: "2계층 구조로 토큰 약 75% 절감" },
];

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const STATIC_BORDER_BG =
  "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(122,185,76,0.55) 80deg, transparent 160deg, transparent 240deg, rgba(15,84,64,0.35) 320deg, transparent 360deg)";

export function OmaSection() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const animateBorder = isDesktop && !reduceMotion;
  const angle = useMotionValue(0);

  useEffect(() => {
    if (!animateBorder) return;
    const ctrl = animate(angle, 360, {
      duration: 7,
      repeat: Infinity,
      ease: "linear",
    });
    return () => ctrl.stop();
  }, [angle, animateBorder]);

  const animatedBorderBackground = useMotionTemplate`conic-gradient(from ${angle}deg at 50% 50%, transparent 0deg, rgba(122,185,76,0.55) 80deg, transparent 160deg, transparent 240deg, rgba(15,84,64,0.35) 320deg, transparent 360deg)`;

  const fadeUpInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 };
  const fadeUpAnimate = reduceMotion
    ? { opacity: 1, transition: { duration: 0.3 } }
    : {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: easeOutExpo },
      };

  const cardInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 24, scale: 0.985 };
  const cardAnimate = reduceMotion
    ? { opacity: 1, transition: { duration: 0.3 } }
    : {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: easeOutExpo, delay: 0.12 },
      };

  const itemStagger = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.06, delayChildren: 0.1 },
    },
  };
  const itemVariant = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: easeOutExpo },
        },
  };

  return (
    <section
      id="oma"
      className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-soft)] py-20 md:py-28"
    >
      {/* Subtle dotted grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,84,64,0.10) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 35%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 35%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
          <motion.div
            initial={fadeUpInitial}
            whileInView={fadeUpAnimate}
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm">
              Engineering
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-primary)] md:text-[40px] md:leading-[1.15]">
              기술의 깊이로 만듭니다
            </h2>
            <SectionHeadingUnderline />
            <p className="mt-12 text-[16px] leading-[1.9] text-[var(--color-fg)] md:mt-16 md:text-[17px] md:leading-[1.95]">
              퍼스트플루크의 모든 솔루션은 우리가 직접 설계한{" "}
              <strong className="font-semibold text-[var(--color-primary)]">
                멀티 에이전트 하네스
              </strong>{" "}
              위에서 돌아갑니다. AI 어시스턴트 하나가 모든 걸 떠안는 대신,
              역할이 다른 전문 에이전트가 한 팀처럼 일하도록 만든 기반을 다졌습니다.  그
              깊이가 솔루션의 일관된 품질을 만듭니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
              <LinkButton
                href={OMA_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
              >
                GitHub에서 보기
              </LinkButton>
              <LinkButton
                href={OMA_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                variant="secondary"
              >
                자세히 알아보기
              </LinkButton>
            </div>
          </motion.div>

          <motion.div
            initial={cardInitial}
            whileInView={cardAnimate}
            viewport={{ once: true, amount: 0.25 }}
            className="relative"
          >
            {/* Animated conic gradient border (desktop) / static fallback (mobile) */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-[1.5px] rounded-2xl opacity-90 blur-[0.5px]"
              style={{ background: animateBorder ? animatedBorderBackground : STATIC_BORDER_BG }}
            />
            {/* Soft outer glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-[radial-gradient(60%_60%_at_50%_40%,rgba(122,185,76,0.18),transparent_70%)] opacity-70 blur-2xl"
            />

            <article
              aria-labelledby="oma-showcase-title"
              className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]"
            >
              <header className="relative flex items-center gap-3 border-b border-[var(--color-border)] px-6 py-5 md:px-8 md:py-6">
                <Image
                  src="/oma-logo.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10"
                  aria-hidden
                />
                <div className="flex flex-col">
                  <h3
                    id="oma-showcase-title"
                    className="font-mono text-xl font-bold tracking-tight text-[var(--color-primary)] md:text-2xl"
                  >
                    oh-my-agent
                  </h3>
                  <p className="text-[12.5px] text-[var(--color-fg-muted)] md:text-[13px]">
                    Portable Multi-Agent Harness
                  </p>
                </div>
              </header>

              <motion.div
                className="relative space-y-6 px-6 py-7 md:px-8 md:py-8"
                variants={itemStagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.div variants={itemVariant}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
                    요청
                  </p>
                  <p className="mt-1.5 text-lg font-semibold text-[var(--color-fg)] md:text-xl">
                    &ldquo;
                    <TypewriterText
                      texts={[
                        "사이트 하나 만들어줘",
                        "회원가입 기능 만들어줘",
                        "예약 시스템 만들어줘",
                        "고객 문의 폼 만들어줘",
                      ]}
                    />
                    &rdquo;
                  </p>
                </motion.div>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {AGENTS.map((agent) => (
                    <motion.li
                      key={agent.tag}
                      variants={itemVariant}
                      className="flex flex-col gap-1"
                    >
                      <p className="text-[15px] font-semibold text-[var(--color-primary)]">
                        {agent.tag}
                      </p>
                      <p className="text-[13px] leading-snug text-[var(--color-fg-muted)]">
                        {agent.desc}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-soft)]/60 px-6 py-5 md:px-8 md:py-6"
                variants={itemStagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                <ul className="grid grid-cols-2 gap-x-5 gap-y-3">
                  {HIGHLIGHTS.map((h) => (
                    <motion.li
                      key={h.label}
                      variants={itemVariant}
                      className="flex flex-col gap-0.5"
                    >
                      <span className="text-[12.5px] font-semibold text-[var(--color-primary)]">
                        {h.label}
                      </span>
                      <span className="text-[12px] leading-snug text-[var(--color-fg-muted)]">
                        {h.desc}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </article>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

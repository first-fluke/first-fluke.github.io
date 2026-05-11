"use client";

import { motion, useReducedMotion } from "motion/react";
import { ContactForm } from "@/components/site/contact-form";
import { SectionHeadingUnderline } from "@/components/site/section-heading-underline";
import { SITE } from "@/lib/site";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

export function ContactSection() {
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: reduceMotion
      ? { transition: { staggerChildren: 0 } }
      : { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const item = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: easeOutExpo },
        },
  };

  return (
    <section
      id="contact"
      className="border-t border-[var(--color-border)] bg-white py-20 md:py-28"
    >
      <motion.div
        className="mx-auto w-full max-w-3xl px-6 md:px-12"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.p
          variants={item}
          className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm"
        >
          Contact
        </motion.p>
        <motion.h2
          variants={item}
          className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-primary)] md:text-4xl"
        >
          문의
        </motion.h2>
        <motion.div variants={item}>
          <SectionHeadingUnderline />
        </motion.div>
        <motion.p
          variants={item}
          className="mt-4 text-base text-[var(--color-fg-muted)] md:text-lg"
        >
          확인 후 영업일 기준 24시간 내 회신드리겠습니다.
        </motion.p>
        <motion.div
          variants={item}
          className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
        >
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="inline-flex items-center gap-1.5 text-[var(--color-fg)] transition-colors hover:text-[var(--color-primary)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="h-4 w-4"
            >
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            <span className="font-medium">{SITE.contactEmail}</span>
          </a>
          <span aria-hidden className="text-[var(--color-border)]">·</span>
          <a
            href={`https://www.threads.com/@${SITE.threadsHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-primary)]"
          >
            Threads{" "}
            <span className="font-medium">@{SITE.threadsHandle}</span>
          </a>
        </motion.div>
        <motion.div variants={item} className="mt-8">
          <ContactForm />
        </motion.div>
      </motion.div>
    </section>
  );
}

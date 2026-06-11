"use client";

import { motion, useReducedMotion } from "motion/react";
import { ContactForm } from "@/components/site/contact-form";
import { SectionHeadingUnderline } from "@/components/site/section-heading-underline";
import { useI18n } from "@/lib/i18n/use-i18n";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

export function ContactSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

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
          {t.contact.heading}
        </motion.h2>
        <motion.div variants={item}>
          <SectionHeadingUnderline />
        </motion.div>
        <motion.p
          variants={item}
          className="mt-4 text-base text-[var(--color-fg-muted)] md:text-lg"
        >
          {t.contact.subtitle}
        </motion.p>
        <motion.div variants={item} className="mt-8">
          <ContactForm />
        </motion.div>
      </motion.div>
    </section>
  );
}

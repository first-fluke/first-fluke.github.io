"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/components/ui/card";
import { SectionHeadingUnderline } from "@/components/site/section-heading-underline";
import { TEAM } from "@/lib/team";
import { useI18n } from "@/lib/i18n/use-i18n";

const BRAKE_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 22,
  mass: 1.1,
};

function LinkedInIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function TeamSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  const container = {
    hidden: {},
    show: reduceMotion
      ? { transition: { staggerChildren: 0 } }
      : { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
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
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : { opacity: 1, y: 0, transition: BRAKE_SPRING },
  };

  return (
    <section
      id="team"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-soft)] py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={heading} className="mb-12 max-w-2xl md:mb-16">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm">
              Team
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-primary)] md:text-4xl">
              {t.team.heading}
            </h2>
            <SectionHeadingUnderline />
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-fg-muted)] md:text-base">
              {t.team.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
            {TEAM.map((member) => {
              const copy = t.team.members[member.id];
              if (!copy) return null;
              return (
                <motion.div key={member.id} variants={card}>
                  <Card className="flex h-full flex-col gap-5 p-6 sm:flex-row sm:items-center md:p-7">
                    <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5">
                      <Image
                        src={member.imageSrc}
                        alt={copy.name}
                        fill
                        unoptimized
                        sizes="96px"
                        className="object-cover"
                      />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                          {copy.name}
                        </h3>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t.team.linkedinAria.replace(
                            "{name}",
                            copy.name,
                          )}
                          className="inline-flex items-center rounded-md p-1 text-[#0a66c2] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]/40"
                        >
                          <LinkedInIcon />
                        </a>
                      </div>
                      <p className="text-[13px] font-medium text-[var(--color-primary)]/80">
                        {copy.role}
                      </p>
                      <p className="text-[14px] leading-relaxed text-[var(--color-fg-muted)] break-keep">
                        {copy.bio}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

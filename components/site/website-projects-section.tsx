"use client";

import * as motion from "motion/react-m";
import { SectionHeadingUnderline } from "@/components/site/section-heading-underline";
import { SolutionCard } from "@/components/site/solution-card";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/use-i18n";
import { WEBSITE_PROJECTS } from "@/lib/website-projects";

const BRAKE_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 22,
  mass: 1.1,
};

/** Screenshot `sizes` for the portfolio column: full width, then 7/12 from lg. */
const PROJECT_IMAGE_SIZES =
  "(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 96px), (max-width: 1151px) calc((100vw - 160px) * 7 / 12), 579px";

export function WebsiteProjectsSection() {
  const { t } = useI18n();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const heading = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: BRAKE_SPRING },
  };

  return (
    <section id="websites" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <motion.div
          variants={container}
          initial={false}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-16"
        >
          <motion.div variants={heading} className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm">
              Website
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-primary)] md:text-4xl">
              {t.websiteProjects.heading}
            </h2>
            <SectionHeadingUnderline />
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-fg-muted)] break-keep md:text-base [&:lang(ja)]:break-normal">
              {t.websiteProjects.subtitle}
            </p>
            <LinkButton href="#contact" className="mt-8">
              {t.websiteProjects.contactCta}
            </LinkButton>
          </motion.div>

          <div
            className={cn(
              "grid grid-cols-1 gap-5 lg:gap-6",
              WEBSITE_PROJECTS.length > 1 && "sm:grid-cols-2",
            )}
          >
            {WEBSITE_PROJECTS.map((project) => (
              <motion.div key={project.id} variants={card}>
                <SolutionCard
                  solution={project}
                  copy={t.websiteProjects.items[project.id]}
                  badgeLabel={t.websiteProjects.badge}
                  imageSizes={PROJECT_IMAGE_SIZES}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

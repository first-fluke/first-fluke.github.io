"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/lib/i18n/use-i18n";

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.84 7.355c.98-1.454 2.568-2.256 4.475-2.256h.044c3.188.02 5.087 1.973 5.276 5.388.108.046.216.094.32.143 1.45.683 2.51 1.717 3.061 2.992.77 1.781.842 4.687-1.532 7.012C17.69 22.31 15.612 23.985 12.186 24zm1.353-9.495c-.92 0-1.764.14-2.34.404-.62.28-.88.71-.85 1.158.07 1.018 1.16 1.604 2.61 1.526 1.32-.07 2.36-.71 3.18-1.96-.42-.13-.91-.22-1.46-.27a8.36 8.36 0 0 0-1.16-.05c-.05 0-.1 0-.16.02h-.05a.215.215 0 0 1-.05-.01z" />
    </svg>
  );
}

function BusinessInfoDisclosure() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={t.footer.business.triggerAria}
        aria-expanded={open}
        aria-controls="footer-business-info"
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className="cursor-help underline decoration-[var(--color-fg-muted)]/50 decoration-dotted underline-offset-4 transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)]"
      >
        © 2026 FIRST FLUKE
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="footer-business-info"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.18, ease: "easeOut" },
            }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : { opacity: 0, y: 4, transition: { duration: 0.12 } }
            }
            className="absolute bottom-full left-0 z-50 mb-3 w-[19rem] rounded-xl border border-[var(--color-border)] bg-white p-4 text-left shadow-[var(--shadow-card-hover)]"
          >
            <p className="text-[13px] font-semibold text-[var(--color-primary)]">
              {t.footer.business.title}
            </p>
            <dl className="mt-2.5 space-y-1.5">
              {t.footer.business.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex gap-2 text-[12.5px] leading-relaxed"
                >
                  <dt className="w-28 shrink-0 text-[var(--color-fg-muted)]">
                    {row.label}
                  </dt>
                  <dd className="text-[var(--color-fg)]">{row.value}</dd>
                </div>
              ))}
            </dl>
            <span
              aria-hidden
              className="absolute -bottom-[5px] left-8 h-2.5 w-2.5 rotate-45 border-r border-b border-[var(--color-border)] bg-white"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export function Footer() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const initial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 };
  const inView = reduceMotion
    ? { opacity: 1, transition: { duration: 0.3 } }
    : {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-8 md:py-10">
      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm text-[var(--color-fg-muted)] md:px-12"
        initial={initial}
        whileInView={inView}
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <p>
            <span className="font-mono italic">fluke (n.)</span>{" "}
            {t.footer.flukeDefinition}
          </p>
          <a
            href={`https://www.threads.com/@${SITE.threadsHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Threads @${SITE.threadsHandle}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--color-primary)]"
          >
            <ThreadsIcon className="h-4 w-4" />
            <span className="font-semibold tracking-tight">Threads</span>
            <span className="text-[var(--color-fg-muted)]">@{SITE.threadsHandle}</span>
          </a>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <BusinessInfoDisclosure />
          <nav aria-label={t.footer.legalAria} className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              {t.footer.privacyLabel}
            </Link>
          </nav>
        </div>
      </motion.div>
    </footer>
  );
}

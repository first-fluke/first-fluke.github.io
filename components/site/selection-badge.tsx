"use client";

import Image from "next/image";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/use-i18n";

interface SelectionBadgeProps {
  variant: "full" | "chip";
  className?: string;
}

export function SelectionBadge({ variant, className }: SelectionBadgeProps) {
  const { t } = useI18n();

  if (variant === "chip") {
    return (
      <a
        href={SITE.selectionPageUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.badge.linkAria}
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-fg)] ring-1 ring-[var(--color-border)] transition-colors hover:ring-[var(--color-primary)]/30",
          className,
        )}
      >
        <Image
          src="/moduecangup-logo.png"
          alt=""
          width={42}
          height={14}
          unoptimized
        />
        <span aria-hidden className="text-[var(--color-border)]">
          ·
        </span>
        <span>{t.badge.chipLabel}</span>
      </a>
    );
  }

  return (
    <a
      href={SITE.selectionPageUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.badge.linkAria}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 transition-colors hover:border-[var(--color-primary)]/30",
        className,
      )}
    >
      <Image
        src="/moduecangup-logo.png"
        alt="모두의 창업"
        width={66}
        height={22}
        unoptimized
        priority
      />
      <span aria-hidden className="h-5 w-px bg-[var(--color-border)]" />
      <span className="flex flex-col text-right leading-tight">
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
          Selected · 2026
        </span>
        <span className="text-[11px] font-semibold text-[var(--color-primary)]">
          {t.badge.providerLabel}
        </span>
      </span>
    </a>
  );
}

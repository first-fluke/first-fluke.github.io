"use client";

import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/i18n.types";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";

interface LanguageSwitcherProps {
  size?: "sm" | "md";
  className?: string;
}

const SHORT_LABELS = {
  ko: "KO",
  en: "EN",
  ja: "JA",
} as const;

export function LanguageSwitcher({ size = "md", className }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.languageSwitcher.groupAria}
      className={cn(
        "inline-flex items-center rounded-full bg-white ring-1 ring-[var(--color-border)]",
        size === "md" ? "gap-0.5 p-1" : "gap-px p-0.5",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-label={LOCALE_LABELS[code]}
            aria-pressed={active}
            onClick={() => setLocale(code)}
            className={cn(
              "cursor-pointer rounded-full font-semibold tracking-wide transition-colors",
              size === "md"
                ? "px-2.5 py-1 text-[11px]"
                : "px-2 py-0.5 text-[10.5px]",
              active
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-fg-muted)] hover:text-[var(--color-primary)]",
            )}
          >
            {SHORT_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}

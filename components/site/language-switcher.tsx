"use client";

import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { Check, Globe } from "@phosphor-icons/react";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/i18n.types";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";

interface LanguageSwitcherProps {
  size?: "sm" | "md";
  className?: string;
}

export function LanguageSwitcher({ size = "md", className }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={t.languageSwitcher.groupAria}
          className={cn(
            "inline-flex cursor-pointer items-center justify-center rounded-full bg-white text-[var(--color-fg-muted)] ring-1 ring-[var(--color-border)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] data-[state=open]:text-[var(--color-primary)]",
            size === "md" ? "h-9 w-9" : "h-8 w-8",
            className,
          )}
        >
          <Globe
            aria-hidden
            className={size === "md" ? "h-[18px] w-[18px]" : "h-4 w-4"}
          />
        </button>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[9rem] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-1 shadow-[0_8px_30px_rgba(15,76,58,0.12)]"
        >
          {LOCALES.map((code) => {
            const active = code === locale;
            return (
              <DropdownMenuPrimitive.Item
                key={code}
                lang={code}
                onSelect={() => setLocale(code)}
                className={cn(
                  "flex cursor-pointer select-none items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-medium outline-none transition-colors focus:bg-[var(--color-primary)]/8 data-[highlighted]:bg-[var(--color-primary)]/8",
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-fg-muted)]",
                )}
              >
                {LOCALE_LABELS[code]}
                {active && <Check aria-hidden className="h-4 w-4" />}
              </DropdownMenuPrimitive.Item>
            );
          })}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

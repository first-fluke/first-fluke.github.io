"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";

export function PrivacyPolicyArticle() {
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-20 md:px-12 md:py-28">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-primary)]"
        >
          {t.privacy.backLink}
        </Link>
        <LanguageSwitcher size="sm" />
      </div>

      <h1 className="mt-6 text-3xl font-bold text-[var(--color-primary)] md:text-4xl">
        {t.privacy.title}
      </h1>
      <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
        {t.privacy.effectiveDate}
      </p>

      <div className="mt-12 space-y-10">
        {t.privacy.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              {section.title}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--color-fg)]">
              {section.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

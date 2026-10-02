import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/i18n.types";

export function ProductFaq({ locale }: { locale: Locale }) {
  const { faq } = DICTIONARIES[locale];

  return (
    <section id="product-guide" aria-labelledby="product-guide-heading" className="border-y border-[var(--color-border)] bg-[var(--color-bg-soft)] py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <h2 id="product-guide-heading" className="text-3xl font-bold tracking-tight text-[var(--color-primary)] md:text-4xl">
          {faq.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">{faq.intro}</p>
        <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {faq.items.map((item) => (
            <div key={item.question}>
              <h3 className="text-lg font-semibold leading-relaxed text-[var(--color-primary)]">{item.question}</h3>
              <p className="mt-3 text-base leading-relaxed">{item.answer}</p>
              <a href={item.href} className="mt-3 inline-block font-medium text-[var(--color-primary)] underline underline-offset-4">
                {item.linkLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ContactForm } from "@/components/site/contact-form";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="border-t border-[var(--color-border)] bg-white py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-3xl px-6 md:px-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] md:text-sm">
          Contact
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-primary)] md:text-4xl">
          문의
        </h2>
        <p className="mt-4 text-base text-[var(--color-fg-muted)] md:text-lg">
          확인 후 최대한 빨리 연락드리겠습니다.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

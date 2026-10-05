"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/lib/i18n/use-i18n";

const ContactForm = lazy(() => import("@/components/site/contact-form")
  .then((module) => ({ default: module.ContactForm })));

export function ContactFormLoader() {
  const host = useRef<HTMLDivElement>(null);
  const [requested, setRequested] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const request = () => setRequested(true);
    const onContactLink = (event: Event) => {
      const anchor = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (anchor && new URL(anchor.href).hash === "#contact") request();
    };
    if (location.hash === "#contact" || !("IntersectionObserver" in window)) {
      request();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        request();
        observer.disconnect();
      }
    }, { rootMargin: "1000px" });
    observer.observe(element);
    document.addEventListener("pointerdown", onContactLink);
    document.addEventListener("click", onContactLink);
    return () => {
      observer.disconnect();
      document.removeEventListener("pointerdown", onContactLink);
      document.removeEventListener("click", onContactLink);
    };
  }, []);

  const fallback = (
    <div aria-busy="true" aria-label={t.contact.heading} className="flex flex-col gap-5">
      <div aria-hidden="true" className="h-[60px] rounded-xl bg-[var(--color-bg-soft)]" />
      <div aria-hidden="true" className="h-[76px] rounded-xl bg-[var(--color-bg-soft)]" />
      <div aria-hidden="true" className="h-[168px] rounded-xl bg-[var(--color-bg-soft)]" />
      <div aria-hidden="true" className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
        <span className="h-4 w-4 rounded bg-[var(--color-bg-soft)]" />
        <span>{t.contact.agreePrefix}{" "}<span className="font-medium">{t.contact.agreeLink}</span></span>
      </div>
      <a href={`mailto:${SITE.contactEmail}`} className="inline-flex h-12 items-center self-start text-sm text-[var(--color-primary)] underline">
        {SITE.contactEmail}
      </a>
    </div>
  );

  return (
    <div ref={host} className="min-h-[452px]">
      {requested ? <Suspense fallback={fallback}><ContactForm /></Suspense> : fallback}
    </div>
  );
}

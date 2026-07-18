"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type MouseEvent } from "react";
import type { Solution } from "@/lib/solutions";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/use-i18n";

interface SolutionCardProps {
  solution: Solution;
}

interface IconFrame {
  containerClass: string;
  imageClass: string;
}

const ICON_FRAMES: Record<string, IconFrame> = {
  shopzy: {
    containerClass:
      "bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)] ring-1 ring-black/5",
    imageClass: "h-8 w-8",
  },
  "place-haejo": {
    containerClass:
      "bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)] ring-1 ring-black/5",
    imageClass: "h-9 w-9",
  },
  "contents-haejo": {
    containerClass:
      "bg-[#1373f4] shadow-[0_2px_8px_rgba(15,23,42,0.08)] ring-1 ring-black/5",
    imageClass: "h-9 w-9",
  },
};

export function SolutionCard({ solution }: SolutionCardProps) {
  const { t } = useI18n();
  const copy = t.solutions.items[solution.id] ?? solution;
  const initial = copy.name.charAt(0);
  const iconSrc = solution.iconSrc;
  const iconFrame = ICON_FRAMES[solution.id];
  const features = copy.features ?? [];
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const node = anchorRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  };

  const iconAvatar = iconSrc ? (
    <span
      aria-hidden
      className={cn(
        "relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full",
        iconFrame ? iconFrame.containerClass : "bg-[var(--color-bg-soft)]",
      )}
    >
      <Image
        src={iconSrc}
        alt=""
        width={44}
        height={44}
        unoptimized
        className={cn(
          "object-cover",
          iconFrame ? iconFrame.imageClass : "h-full w-full",
        )}
      />
    </span>
  ) : (
    <span
      aria-hidden
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-bg-soft)] text-base font-semibold text-[var(--color-primary)]"
    >
      {initial}
    </span>
  );

  return (
    <a
      ref={anchorRef}
      href={solution.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.solutions.openAria.replace("{name}", copy.name)}
      onMouseMove={handleMouseMove}
      className="group relative block h-full rounded-2xl focus:outline-none"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as CSSProperties
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            "radial-gradient(480px circle at var(--mouse-x) var(--mouse-y), rgba(122,185,76,0.16), transparent 60%)",
        }}
      />
      <Card className="relative flex h-full flex-col overflow-hidden p-0 group-hover:-translate-y-1.5 group-hover:border-[var(--color-primary)]/40 group-hover:shadow-[var(--shadow-card-hover)] group-focus-visible:-translate-y-1.5 group-focus-visible:border-[var(--color-primary)]/40 group-focus-visible:shadow-[var(--shadow-card-hover)]">
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg-soft)]">
          {solution.screenshotSrc ? (
            <Image
              src={solution.screenshotSrc}
              alt={`${copy.name} — ${copy.tagline}`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--color-bg-soft)] to-white">
              <span className="scale-150 opacity-90">{iconAvatar}</span>
            </div>
          )}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20 backdrop-blur-sm">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
            />
            {t.solutions.liveBadge}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {iconAvatar}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                  {copy.name}
                </h3>
                <p className="text-[12px] text-[var(--color-fg-muted)]">
                  {copy.category}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
            {copy.tagline}
          </p>

          {features.length > 0 && (
            <ul className="flex flex-col gap-2">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-[13.5px] leading-snug text-[var(--color-fg)]"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                  >
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-semibold text-[var(--color-primary)]">
            {t.solutions.viewCta}
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-0.5"
            >
              ↗
            </span>
          </div>
        </div>
      </Card>
    </a>
  );
}

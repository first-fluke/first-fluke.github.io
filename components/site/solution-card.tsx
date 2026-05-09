"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type MouseEvent } from "react";
import type { Solution } from "@/lib/solutions";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface SolutionCardProps {
  solution: Solution;
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const initial = solution.name.charAt(0);
  const iconSrc = solution.iconSrc;
  const isShopzy = solution.id === "shopzy";
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const node = anchorRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  };

  return (
    <a
      ref={anchorRef}
      href={solution.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${solution.name} 외부 사이트로 이동`}
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
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            "radial-gradient(480px circle at var(--mouse-x) var(--mouse-y), rgba(122,185,76,0.24), transparent 60%)",
        }}
      />
      <Card className="relative flex h-full flex-col gap-5 p-6 transition-[transform,box-shadow,border-color] duration-200 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.015] group-hover:border-[var(--color-primary)]/40 group-hover:shadow-[var(--shadow-card-hover)] group-focus-visible:-translate-y-1.5 group-focus-visible:scale-[1.015] group-focus-visible:border-[var(--color-primary)]/40 group-focus-visible:shadow-[var(--shadow-card-hover)] md:p-7">
        <div className="flex items-start justify-between">
          {iconSrc ? (
            <span
              aria-hidden
              className={cn(
                "relative grid h-14 w-14 place-items-center overflow-hidden rounded-full",
                isShopzy
                  ? "bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)] ring-1 ring-black/5"
                  : "bg-[var(--color-bg-soft)]",
              )}
            >
              <Image
                src={iconSrc}
                alt=""
                width={56}
                height={56}
                unoptimized
                className={cn(
                  "object-cover",
                  isShopzy ? "h-11 w-11" : "h-full w-full",
                )}
              />
            </span>
          ) : (
            <span
              aria-hidden
              className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-bg-soft)] text-lg font-semibold text-[var(--color-primary)]"
            >
              {initial}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 text-[11px] font-medium text-[var(--color-fg-muted)]">
              {solution.category}
            </span>
            <span
              aria-hidden
              className="inline-block text-[var(--color-fg-muted)] transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-[var(--color-primary)] group-focus-visible:translate-x-1 group-focus-visible:-translate-y-0.5 group-focus-visible:scale-110 group-focus-visible:text-[var(--color-primary)]"
            >
              ↗
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="text-xl font-semibold text-[var(--color-primary)]">
            {solution.name}
          </h3>
          <p className="text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
            {solution.tagline}
          </p>
        </div>
      </Card>
    </a>
  );
}

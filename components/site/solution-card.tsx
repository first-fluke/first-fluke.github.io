import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Solution } from "@/lib/solutions";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface SolutionCardProps {
  solution: Solution;
}

function hasIcon(iconSrc: string | undefined): iconSrc is string {
  if (!iconSrc) return false;
  const filePath = path.join(process.cwd(), "public", iconSrc);
  return existsSync(filePath);
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const initial = solution.name.charAt(0);
  const iconAvailable = hasIcon(solution.iconSrc);
  const isShopzy = solution.id === "shopzy";

  return (
    <a
      href={solution.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${solution.name} 외부 사이트로 이동`}
      className={cn(
        "group block h-full focus:outline-none",
        "rounded-2xl",
      )}
    >
      <Card className="flex h-full flex-col gap-5 p-6 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-card-hover)] group-focus-visible:-translate-y-0.5 group-focus-visible:shadow-[var(--shadow-card-hover)] md:p-7">
        <div className="flex items-start justify-between">
          {iconAvailable ? (
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
                src={solution.iconSrc!}
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
              className="text-[var(--color-fg-muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)] group-focus-visible:translate-x-0.5 group-focus-visible:text-[var(--color-primary)]"
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

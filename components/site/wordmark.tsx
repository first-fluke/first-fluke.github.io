"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/use-i18n";

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  const { t } = useI18n();

  return (
    <Link
      href="/"
      aria-label={t.header.homeAria}
      className={cn(
        "inline-flex items-center gap-2 text-[var(--color-primary)]",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt=""
        width={40}
        height={40}
        priority
        unoptimized
        className="h-10 w-auto"
      />
      <span className="text-base font-bold tracking-[0.04em]">FIRST FLUKE</span>
    </Link>
  );
}

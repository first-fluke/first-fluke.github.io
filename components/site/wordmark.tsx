import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <Link
      href="/"
      aria-label="FIRST FLUKE 홈"
      className={cn(
        "inline-flex items-center gap-2 text-[var(--color-primary)]",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt=""
        width={32}
        height={40}
        priority
        unoptimized
        className="h-10 w-auto"
      />
      <span className="text-base font-bold tracking-[0.04em]">FIRST FLUKE</span>
    </Link>
  );
}

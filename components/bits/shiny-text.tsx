import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
}

/**
 * Text with a slow light sweep across it (React Bits `ShinyText` style).
 * Pure CSS: gradient clipped to text, animated via the `animate-shine` token.
 */
export function ShinyText({ children, className }: ShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent lg:animate-shine motion-reduce:animate-none",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(110deg, var(--color-primary) 38%, #a3d97a 50%, var(--color-primary) 62%)",
        backgroundSize: "200% auto",
      }}
    >
      {children}
    </span>
  );
}

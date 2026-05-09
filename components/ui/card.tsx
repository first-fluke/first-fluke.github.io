import * as React from "react";
import { cn } from "@/lib/cn";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]",
      "transition-[transform,box-shadow] duration-200 ease-out",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

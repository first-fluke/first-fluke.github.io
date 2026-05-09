import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-12 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-[15px] text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)]",
      "transition-colors duration-150 hover:border-[var(--color-primary)]/40",
      "focus:border-[var(--color-primary)] focus:outline-none",
      "aria-[invalid=true]:border-red-500",
      "disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

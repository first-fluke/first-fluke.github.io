import * as React from "react";
import { cn } from "@/lib/cn";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[140px] w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[15px] text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)]",
      "transition-[border-color,box-shadow] duration-200 ease-out hover:border-[var(--color-primary)]/40",
      "focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/15",
      "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20",
      "disabled:cursor-not-allowed disabled:opacity-60",
      "motion-reduce:transition-none",
      "resize-y",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

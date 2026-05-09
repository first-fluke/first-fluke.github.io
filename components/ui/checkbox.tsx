"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex cursor-pointer select-none items-center gap-2 text-sm text-[var(--color-fg)]",
          props.disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            "h-4 w-4 cursor-pointer appearance-none rounded border border-[var(--color-border)] bg-white",
            "checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)]",
            "checked:bg-[length:12px_12px] checked:bg-center checked:bg-no-repeat",
            "checked:[background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'><path d='M13.485 4.515a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L6.778 9.808l5.293-5.293a1 1 0 0 1 1.414 0z'/></svg>\")]",
            "transition-colors duration-150",
            "disabled:cursor-not-allowed",
          )}
          {...props}
        />
        {label}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";

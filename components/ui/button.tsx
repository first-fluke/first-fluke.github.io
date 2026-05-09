import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[#0c3f30] active:bg-[#093327]",
  secondary:
    "bg-white text-[var(--color-primary)] border border-[var(--color-primary)]/30 hover:border-[var(--color-primary)] hover:bg-white",
  ghost:
    "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-bg-soft)]",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,transform,box-shadow] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(BASE, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <a
      ref={ref}
      className={cn(BASE, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}
      {...props}
    />
  ),
);
LinkButton.displayName = "LinkButton";

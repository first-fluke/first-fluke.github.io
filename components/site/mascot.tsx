import Image from "next/image";
import { cn } from "@/lib/cn";

interface MascotProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

export function Mascot({ className, size = 360, priority = false }: MascotProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-white",
        "shadow-[0_24px_60px_-20px_rgba(15,76,58,0.25)]",
        "ring-1 ring-[var(--color-border)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/firstfluke-mascot.png"
        alt="FIRST FLUKE 마스코트 (수달)"
        width={size * 2}
        height={size * 2}
        priority={priority}
        quality={95}
        sizes={`${size}px`}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

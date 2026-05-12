"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#oma", label: "Engineering" },
  { href: "#solutions", label: "Solution" },
  { href: "#contact", label: "Contact" },
];

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export function FloatingNav() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    setVisible(current >= 80);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="섹션 네비게이션"
          initial={reduceMotion ? { opacity: 0 } : { y: -80, opacity: 0 }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: -80, opacity: 0 }}
          transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
          className="fixed inset-x-0 top-4 z-40 mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-full border border-[var(--color-border)] bg-white/85 px-3 py-2 shadow-[0_8px_30px_rgba(15,76,58,0.08)] backdrop-blur-md md:gap-2 md:px-5 md:py-2.5"
        >
          <a
            href="#top"
            aria-label="맨 위로"
            className="mr-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-1.5 py-0.5 text-[var(--color-primary)] md:mr-2"
          >
            <Image
              src="/logo.png"
              alt=""
              width={24}
              height={24}
              unoptimized
              className="h-6 w-6"
            />
            <span className="hidden text-[13px] font-bold tracking-tight sm:inline">
              FIRST FLUKE
            </span>
          </a>
          <span
            aria-hidden
            className="hidden h-4 w-px bg-[var(--color-border)] sm:inline-block"
          />
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-2.5 py-1 text-[13px] font-medium text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-primary)] md:px-3 md:text-sm"
            >
              {item.label}
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

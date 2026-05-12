"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

type Mode = "typing" | "pausing-type" | "erasing" | "pausing-erase";

interface TypewriterTextProps {
  texts: string[];
  typeSpeed?: number;
  eraseSpeed?: number;
  pauseAfterType?: number;
  pauseAfterErase?: number;
  className?: string;
  cursor?: boolean;
}

export function TypewriterText({
  texts,
  typeSpeed = 90,
  eraseSpeed = 45,
  pauseAfterType = 1800,
  pauseAfterErase = 350,
  className,
  cursor = true,
}: TypewriterTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [mode, setMode] = useState<Mode>("typing");

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const currentText = texts[textIdx];
    if (!currentText) return;

    let timer: number;

    if (mode === "typing") {
      if (displayed.length < currentText.length) {
        timer = window.setTimeout(() => {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        }, typeSpeed);
      } else {
        timer = window.setTimeout(() => setMode("pausing-type"), 0);
      }
    } else if (mode === "pausing-type") {
      timer = window.setTimeout(() => setMode("erasing"), pauseAfterType);
    } else if (mode === "erasing") {
      if (displayed.length > 0) {
        timer = window.setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, eraseSpeed);
      } else {
        timer = window.setTimeout(() => setMode("pausing-erase"), 0);
      }
    } else {
      timer = window.setTimeout(() => {
        setTextIdx((prev) => (prev + 1) % texts.length);
        setMode("typing");
      }, pauseAfterErase);
    }

    return () => window.clearTimeout(timer);
  }, [
    inView,
    reduceMotion,
    displayed,
    mode,
    textIdx,
    texts,
    typeSpeed,
    eraseSpeed,
    pauseAfterType,
    pauseAfterErase,
  ]);

  const visibleText = reduceMotion ? (texts[0] ?? "") : displayed;

  return (
    <span ref={ref} className={className} aria-label={texts[0]}>
      <span aria-hidden>{visibleText}</span>
      {cursor && (
        <span
          aria-hidden
          className="ml-[1px] inline-block h-[1em] w-[2px] -translate-y-[2px] animate-pulse bg-current align-middle"
        />
      )}
    </span>
  );
}

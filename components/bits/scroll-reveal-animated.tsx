"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { useScroll, useTransform, type MotionValue } from "motion/react";
import * as motion from "motion/react-m";
import {
  tokenizeWords,
  type TextToken,
  type WordToken,
} from "@/components/bits/text-segmenter";

interface ScrollRevealAnimatedProps {
  text: string;
  className?: string;
}

/** Fraction of the paragraph's scroll range each word takes to fully reveal. */
const WORD_WINDOW = 0.3;
// Keep text readable throughout the scroll animation, including before reveal.
const DIM_OPACITY = 0.8;
const subscribeToHydration = () => () => undefined;
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

interface RevealWordProps {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: string;
  hydrated: boolean;
}

function RevealWord({ progress, start, end, children, hydrated }: RevealWordProps) {
  const opacity = useTransform(progress, [start, end], [DIM_OPACITY, 1]);
  const y = useTransform(progress, [start, end], [6, 0]);
  return (
    <motion.span className="inline-block" style={hydrated ? { opacity, y } : undefined}>
      {children}
    </motion.span>
  );
}

/**
 * Words brighten one after another as the paragraph scrolls through the
 * viewport, scrubbed to scroll position (React Bits `ScrollReveal` style).
 */
export function ScrollRevealAnimated({ text, className }: ScrollRevealAnimatedProps) {
  // Keep exported HTML readable; enable scroll effects after hydration.
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );
  const ref = useRef<HTMLParagraphElement>(null);
  const tokens = useMemo(() => {
    const raw = tokenizeWords(text);
    const wordCount = Math.max(raw.filter((t) => t.kind === "word").length, 1);
    const list: Array<
      Exclude<TextToken, WordToken> | (WordToken & { start: number })
    > = [];
    for (let i = 0, wordIndex = 0; i < raw.length; i++) {
      const token = raw[i];
      if (token.kind !== "word") {
        list.push(token);
        continue;
      }
      list.push({
        ...token,
        start: (wordIndex / wordCount) * (1 - WORD_WINDOW),
      });
      wordIndex += 1;
    }
    return list;
  }, [text]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 50%"],
  });

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {tokens.map((token, i) => {
          if (token.kind === "break") return <br key={i} />;
          if (token.kind === "space") return <span key={i}> </span>;
          return (
            <RevealWord
              key={i}
              progress={scrollYProgress}
              start={token.start}
              end={token.start + WORD_WINDOW}
              hydrated={hydrated}
            >
              {token.text}
            </RevealWord>
          );
        })}
      </span>
    </p>
  );
}

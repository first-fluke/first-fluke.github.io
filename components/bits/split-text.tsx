"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import {
  splitGraphemes,
  tokenizeWords,
} from "@/components/bits/text-segmenter";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

interface SplitTextProps {
  /** Text to reveal. `\n` renders a line break. */
  text: string;
  className?: string;
  /** Seconds before the first glyph starts. */
  delay?: number;
  /** Seconds between consecutive glyphs (upper bound). */
  stagger?: number;
  /**
   * Total seconds the stagger may span regardless of glyph count, so long
   * strings (e.g. English titles) finish about as fast as short CJK ones.
   */
  staggerBudget?: number;
}

/**
 * Glyph-by-glyph rise-and-fade reveal (React Bits `SplitText` style).
 * Words stay unbreakable so lines wrap only at natural boundaries; the
 * full string is mirrored in a visually-hidden span for assistive tech.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.035,
  staggerBudget = 0.6,
}: SplitTextProps) {
  const { tokens, glyphTotal } = useMemo(() => {
    let count = 0;
    const list = tokenizeWords(text).map((token) => {
      if (token.kind !== "word") return token;
      const glyphs = splitGraphemes(token.text).map((glyph) => ({
        glyph,
        index: count++,
      }));
      return { ...token, glyphs };
    });
    return { tokens: list, glyphTotal: count };
  }, [text]);
  const glyphStagger = Math.min(
    stagger,
    staggerBudget / Math.max(glyphTotal, 1),
  );

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {tokens.map((token, tokenIndex) => {
          if (token.kind === "break") return <br key={tokenIndex} />;
          if (token.kind === "space") return <span key={tokenIndex}> </span>;
          return (
            <span key={tokenIndex} className="inline-block whitespace-nowrap">
              {token.glyphs.map(({ glyph, index }) => {
                return (
                  <motion.span
                    key={index}
                    className="inline-block will-change-transform"
                    initial={{ y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      ease: EASE_OUT_EXPO,
                      delay: delay + index * glyphStagger,
                    }}
                  >
                    {glyph}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </span>
    </span>
  );
}

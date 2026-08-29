/**
 * Locale-aware text splitting helpers shared by the text-animation bits.
 *
 * Uses `Intl.Segmenter` when available so CJK text (ja/zh with no spaces,
 * ko with spaces) splits into sensible word / grapheme units; falls back to
 * naive splitting otherwise. Runs identically on server and client, so the
 * SSR markup matches hydration.
 */

export interface WordToken {
  kind: "word";
  text: string;
}

export interface SpaceToken {
  kind: "space";
}

export interface BreakToken {
  kind: "break";
}

export type TextToken = WordToken | SpaceToken | BreakToken;

function hasSegmenter(): boolean {
  return typeof Intl !== "undefined" && typeof Intl.Segmenter === "function";
}

/** Splits into user-perceived characters (handles combining marks, emoji). */
export function splitGraphemes(text: string): string[] {
  if (hasSegmenter()) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/**
 * Splits into word tokens separated by spaces / line breaks.
 * Trailing punctuation is glued to the preceding word so it never wraps alone.
 */
export function tokenizeWords(text: string): TextToken[] {
  const tokens: TextToken[] = [];

  const pushWord = (word: string) => {
    const prev = tokens[tokens.length - 1];
    const isPunctuationOnly = !/[\p{L}\p{N}]/u.test(word);
    if (isPunctuationOnly && prev && prev.kind === "word") {
      prev.text += word;
      return;
    }
    tokens.push({ kind: "word", text: word });
  };

  text.split("\n").forEach((line, lineIndex) => {
    if (lineIndex > 0) tokens.push({ kind: "break" });

    if (hasSegmenter()) {
      const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
      for (const seg of segmenter.segment(line)) {
        if (/^\s+$/.test(seg.segment)) {
          if (tokens[tokens.length - 1]?.kind !== "space") {
            tokens.push({ kind: "space" });
          }
          continue;
        }
        if (seg.segment.length === 0) continue;
        pushWord(seg.segment);
      }
      return;
    }

    line.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) tokens.push({ kind: "space" });
      else pushWord(part);
    });
  });

  return tokens;
}

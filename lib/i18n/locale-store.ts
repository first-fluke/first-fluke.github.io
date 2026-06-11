import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/i18n.types";

const STORAGE_KEY = "ff-locale";

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

function detectInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // localStorage unavailable (private mode etc.) — fall through to navigator
  }
  const lang = window.navigator.language?.toLowerCase() ?? "";
  if (lang.startsWith("ko")) return "ko";
  if (lang.startsWith("ja")) return "ja";
  return "en";
}

// The server/build snapshot is always the default locale so that static HTML
// stays deterministic; the real locale kicks in right after hydration.
let currentLocale: Locale =
  typeof window === "undefined" ? DEFAULT_LOCALE : detectInitialLocale();

const listeners = new Set<() => void>();

export function getLocaleSnapshot(): Locale {
  return currentLocale;
}

export function getServerLocaleSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function subscribeToLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLocale(next: Locale): void {
  if (next === currentLocale) return;
  currentLocale = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // persistence is best-effort
  }
  listeners.forEach((listener) => listener());
}

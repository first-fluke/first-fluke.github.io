"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Dictionary, Locale } from "@/lib/i18n/i18n.types";
import { DICTIONARY_KO } from "@/lib/i18n/dictionary-ko";
import { DICTIONARY_EN } from "@/lib/i18n/dictionary-en";
import { DICTIONARY_JA } from "@/lib/i18n/dictionary-ja";
import {
  getLocaleSnapshot,
  getServerLocaleSnapshot,
  setLocale,
  subscribeToLocale,
} from "@/lib/i18n/locale-store";

const DICTIONARIES: Record<Locale, Dictionary> = {
  ko: DICTIONARY_KO,
  en: DICTIONARY_EN,
  ja: DICTIONARY_JA,
};

export interface I18n {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Dictionary;
}

export function useI18n(): I18n {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return { locale, setLocale, t: DICTIONARIES[locale] };
}

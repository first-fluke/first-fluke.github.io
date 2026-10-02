"use client";

import { useParams } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n/i18n.types";
import { DICTIONARY_KO } from "@/lib/i18n/dictionary-ko";
import { DICTIONARY_EN } from "@/lib/i18n/dictionary-en";
import { DICTIONARY_JA } from "@/lib/i18n/dictionary-ja";

const DICTIONARIES: Record<Locale, Dictionary> = {
  ko: DICTIONARY_KO,
  en: DICTIONARY_EN,
  ja: DICTIONARY_JA,
};

export interface I18n {
  locale: Locale;
  t: Dictionary;
}

export function useI18n(): I18n {
  const params = useParams();
  const locale: Locale = params.locale === "en" || params.locale === "ja" ? params.locale : "ko";
  return { locale, t: DICTIONARIES[locale] };
}

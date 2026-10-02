import type { Dictionary, Locale } from "@/lib/i18n/i18n.types";
import { DICTIONARY_KO } from "@/lib/i18n/dictionary-ko";
import { DICTIONARY_EN } from "@/lib/i18n/dictionary-en";
import { DICTIONARY_JA } from "@/lib/i18n/dictionary-ja";

export const DICTIONARIES: Record<Locale, Dictionary> = {
  ko: DICTIONARY_KO,
  en: DICTIONARY_EN,
  ja: DICTIONARY_JA,
};

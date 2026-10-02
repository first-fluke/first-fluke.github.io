"use client";

import { useParams } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n/i18n.types";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";

export interface I18n {
  locale: Locale;
  t: Dictionary;
}

export function useI18n(): I18n {
  const params = useParams();
  const locale: Locale = params.locale === "en" || params.locale === "ja" ? params.locale : "ko";
  return { locale, t: DICTIONARIES[locale] };
}

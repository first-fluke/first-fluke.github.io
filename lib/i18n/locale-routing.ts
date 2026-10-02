import type { Locale } from "@/lib/i18n/i18n.types";

/** Keep Korean at the existing URL; translated pages have stable URL prefixes. */
export function localizedPath(locale: Locale, pathname = "/"): string {
  const unprefixed = pathname.replace(/^\/(en|ja)(?=\/|$)/, "") || "/";
  const path = unprefixed.endsWith("/") ? unprefixed : `${unprefixed}/`;
  return locale === "ko" ? path : `/${locale}${path}`;
}

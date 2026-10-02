import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { LOCALES } from "@/lib/i18n/i18n.types";
import { localizedPath } from "@/lib/i18n/locale-routing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE.url}${localizedPath(locale)}`]),
  );
  // Omit lastModified until an actual content modification date is available.
  return LOCALES.map((locale) => ({
    url: languages[locale],
    alternates: { languages: { ...languages, "x-default": languages.ko } },
  }));
}

import type { Metadata, Viewport } from "next";
import { SITE } from "@/lib/site";
import { LOCALES, type Locale } from "@/lib/i18n/i18n.types";
import { localizedPath } from "@/lib/i18n/locale-routing";

const SEO_COPY = {
  ko: {
    title: "퍼스트플루크(FIRST FLUKE) | AI SaaS 프로덕트 컴퍼니",
    description: "퍼스트플루크는 소상공인 마케팅, SNS 콘텐츠, 법령 리서치, 쇼핑몰 운영을 위한 AI SaaS 제품을 직접 개발·운영합니다. 플레이스해줘, 콘텐츠해줘, 법률검토해줘, 샵지를 만나보세요.",
    privacyTitle: "개인정보처리방침 · FIRST FLUKE",
    privacyDescription: "FIRST FLUKE 홈페이지 문의 폼에서 수집하는 개인정보의 처리에 관한 사항을 안내합니다.",
    openGraphLocale: "ko_KR",
  },
  en: {
    title: "FIRST FLUKE | AI SaaS Product Company",
    description: "FIRST FLUKE builds and operates AI SaaS products for local-business marketing, social content, legal research, and online-store operations. Explore our products and meet the team.",
    privacyTitle: "Privacy Policy · FIRST FLUKE",
    privacyDescription: "Learn how FIRST FLUKE handles personal information collected through the website contact form.",
    openGraphLocale: "en_US",
  },
  ja: {
    title: "FIRST FLUKE | AI SaaSプロダクトカンパニー",
    description: "FIRST FLUKEは、小規模事業者のマーケティング、SNSコンテンツ、法令リサーチ、オンラインショップ運営のためのAI SaaSを開発・運営しています。製品とチームをご紹介します。",
    privacyTitle: "プライバシーポリシー · FIRST FLUKE",
    privacyDescription: "FIRST FLUKEのお問い合わせフォームで収集する個人情報の取り扱いについてご案内します。",
    openGraphLocale: "ja_JP",
  },
} as const;

export const SHARED_METADATA: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  icons: { icon: "/favicon.png" },
  manifest: "/manifest.webmanifest",
  verification: {
    other: { "msvalidate.01": "AB465FAFD5463302675999E4C50844FA" },
  },
};

export const SITE_VIEWPORT: Viewport = { themeColor: "#0f4c3a" };

export function createPageMetadata(locale: Locale, page: "home" | "privacy"): Metadata {
  const copy = SEO_COPY[locale];
  const isHome = page === "home";
  const pathname = isHome ? "/" : "/privacy";
  const url = `${SITE.url}${localizedPath(locale, pathname)}`;
  const title = isHome ? copy.title : copy.privacyTitle;
  const description = isHome ? copy.description : copy.privacyDescription;
  const languages = Object.fromEntries(
    LOCALES.map((code) => [code, `${SITE.url}${localizedPath(code, pathname)}`]),
  );

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": languages.ko },
    },
    robots: isHome
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description,
      url,
      locale: copy.openGraphLocale,
      alternateLocale: LOCALES.filter((code) => code !== locale).map((code) => SEO_COPY[code].openGraphLocale),
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, type: "image/png", alt: "FIRST FLUKE — Make Your First Win" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/twitter-image.png", alt: "FIRST FLUKE — Make Your First Win" }],
    },
  };
}

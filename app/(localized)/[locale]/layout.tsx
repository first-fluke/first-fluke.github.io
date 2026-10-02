import { notFound } from "next/navigation";
import { SiteDocument } from "@/components/site/site-document";
import { SHARED_METADATA, SITE_VIEWPORT } from "@/lib/site-seo";

export const metadata = SHARED_METADATA;
export const viewport = SITE_VIEWPORT;
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }];
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ja") notFound();
  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}

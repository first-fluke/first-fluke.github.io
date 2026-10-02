import { notFound } from "next/navigation";
import { HomePage } from "@/components/site/home-page";
import { createPageMetadata } from "@/lib/site-seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ja") notFound();
  return createPageMetadata(locale, "home");
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ja") notFound();
  return <HomePage locale={locale} />;
}

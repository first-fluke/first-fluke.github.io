import { notFound } from "next/navigation";
import { PrivacyPolicyArticle } from "@/components/site/privacy-policy-article";
import { createPageMetadata } from "@/lib/site-seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ja") notFound();
  return createPageMetadata(locale, "privacy");
}

export default function LocalizedPrivacyPage() {
  return <PrivacyPolicyArticle />;
}

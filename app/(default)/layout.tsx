import { SiteDocument } from "@/components/site/site-document";
import { SHARED_METADATA, SITE_VIEWPORT } from "@/lib/site-seo";

export const metadata = SHARED_METADATA;
export const viewport = SITE_VIEWPORT;

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument locale="ko">{children}</SiteDocument>;
}

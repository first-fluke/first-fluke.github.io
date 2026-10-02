import { HomePage } from "@/components/site/home-page";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata("ko", "home");

export default function Home() {
  return <HomePage />;
}

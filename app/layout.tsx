import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SITE } from "@/lib/site";
import { SOLUTIONS } from "@/lib/solutions";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://firstfluke.com"),
  title: {
    default: "FIRST FLUKE",
    template: "%s · FIRST FLUKE",
  },
  description:
    "AI와 기술로 더 나은 일상을 만드는 팀, FIRST FLUKE. 모두의 창업 2026 AI 솔루션 공급기업 선정.",
  keywords: ["FIRST FLUKE", "Firstfluke", "퍼스트플루크", "AI 솔루션", "모두의 창업"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://firstfluke.com",
    siteName: "FIRST FLUKE",
    title: "FIRST FLUKE — Make Your First Win",
    description:
      "AI와 기술로 더 나은 일상을 만드는 팀, FIRST FLUKE.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "FIRST FLUKE — Make Your First Win",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FIRST FLUKE — Make Your First Win",
    description:
      "AI와 기술로 더 나은 일상을 만드는 팀.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
  alternates: {
    canonical: "https://firstfluke.com",
  },
};

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/og.png`,
  sameAs: [`https://www.threads.net/@${SITE.threadsHandle}`],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE.url}/#contact`,
      availableLanguage: ["Korean", "English"],
    },
  ],
  award: SITE.selectionLabel,
  makesOffer: SOLUTIONS.map((solution) => ({
    "@type": "Offer",
    name: solution.name,
    category: solution.category,
    url: solution.href,
    itemOffered: {
      "@type": "SoftwareApplication",
      name: solution.name,
      description: solution.tagline,
      applicationCategory: "BusinessApplication",
      url: solution.href,
    },
  })),
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  inLanguage: "ko-KR",
  publisher: { "@id": `${SITE.url}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full antialiased flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';if(!location.hash){window.scrollTo(0,0);}}",
          }}
        />
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSONLD),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBSITE_JSONLD),
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ClarityAnalytics } from "@/components/site/clarity";
import { SITE } from "@/lib/site";
import { SOLUTIONS } from "@/lib/solutions";
import "./globals.css";

const CLARITY_PROJECT_ID = "wpd0eau95q";

export const metadata: Metadata = {
  metadataBase: new URL("https://firstfluke.com"),
  title: {
    default: "FIRST FLUKE",
    template: "%s · FIRST FLUKE",
  },
  description:
    "퍼스트플루크(FIRST FLUKE)는 자체 AI SaaS 제품을 직접 만들고 운영하는 AI 프로덕트 컴퍼니입니다. 플레이스 해줘 · 콘텐츠 해줘 · 법률 검토해줘 · Shopzy. 모두의 창업 2026 AI 솔루션 공급기업 선정.",
  keywords: [
    "FIRST FLUKE",
    "Firstfluke",
    "퍼스트플루크",
    "AI SaaS",
    "AI 프로덕트 컴퍼니",
    "AI 솔루션",
    "모두의 창업",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://firstfluke.com",
    siteName: "FIRST FLUKE",
    title: "FIRST FLUKE — Make Your First Win",
    description:
      "자체 AI SaaS 제품을 직접 만들고 운영하는 AI 프로덕트 컴퍼니, FIRST FLUKE.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIRST FLUKE — Make Your First Win",
    description:
      "자체 AI SaaS 제품을 직접 만들고 운영하는 AI 프로덕트 컴퍼니.",
  },
  icons: {
    icon: "/favicon.png",
  },
  alternates: {
    canonical: "https://firstfluke.com",
  },
  verification: {
    other: {
      "msvalidate.01": "AB465FAFD5463302675999E4C50844FA",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0f4c3a",
};

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/opengraph-image`,
  email: SITE.contactEmail,
  foundingDate: "2026-03",
  sameAs: [`https://www.threads.com/@${SITE.threadsHandle}`],
  founder: [
    {
      "@type": "Person",
      name: "Kim Gahyun",
      jobTitle: "CEO & Developer",
      sameAs: ["https://www.linkedin.com/in/otti-nuna/"],
    },
    {
      "@type": "Person",
      name: "Shin Eunkwang",
      jobTitle: "Co-founder & Developer",
      sameAs: ["https://www.linkedin.com/in/gracefullight/"],
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.contactEmail,
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
        <ClarityAnalytics projectId={CLARITY_PROJECT_ID} />
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

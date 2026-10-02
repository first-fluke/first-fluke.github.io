import { Analytics } from "@vercel/analytics/next";
import { ClarityAnalytics } from "@/components/site/clarity";
import { SITE } from "@/lib/site";
import { SOLUTIONS } from "@/lib/solutions";
import type { Locale } from "@/lib/i18n/i18n.types";
import "@/app/globals.css";

const CLARITY_PROJECT_ID = "wpd0eau95q";

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: ["퍼스트플루크", "Firstfluke"],
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/opengraph-image.png`,
  email: SITE.contactEmail,
  foundingDate: "2026-03",
  sameAs: [`https://www.threads.com/@${SITE.threadsHandle}`],
  founder: [
    {
      "@type": "Person",
      name: "Kim Gahyun",
      jobTitle: "Co-Founder & CEO",
      sameAs: ["https://www.linkedin.com/in/otti-nuna/"],
    },
    {
      "@type": "Person",
      name: "Shin Eunkwang",
      jobTitle: "Co-Founder & CTO",
      sameAs: ["https://www.linkedin.com/in/gracefullight/"],
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.contactEmail,
      url: `${SITE.url}/#contact`,
      availableLanguage: ["Korean", "English", "Japanese"],
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
  alternateName: ["퍼스트플루크", "Firstfluke"],
  url: SITE.url,
  inLanguage: ["ko", "en", "ja"],
  publisher: { "@id": `${SITE.url}/#organization` },
};

export function SiteDocument({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
}>) {
  return (
    <html lang={locale} className="h-full">
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
            __html: JSON.stringify(ORGANIZATION_JSONLD).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBSITE_JSONLD).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}

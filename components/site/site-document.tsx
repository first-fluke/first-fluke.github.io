import { ClarityAnalytics } from "@/components/site/clarity";
import { SiteMotion } from "@/components/site/site-motion";
import { SITE } from "@/lib/site";
import { TEAM } from "@/lib/team";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/i18n.types";
import "@/app/globals.css";
import localFont from "next/font/local";

const siteFont = localFont({
  src: "../../public/fonts/first-fluke-sans.woff2",
  variable: "--font-first-fluke",
  display: "swap",
  weight: "45 920",
  adjustFontFallback: false,
});

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
  const { footer, team } = DICTIONARIES[locale];
  const organization = {
    ...ORGANIZATION_JSONLD,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Business registration number",
      value: footer.business.rows[0].value,
    },
    telephone: "+82-10-3953-2827",
    address: {
      "@type": "PostalAddress",
      streetAddress: footer.business.rows[3].value,
      addressCountry: "KR",
    },
    founder: TEAM.map((member) => ({
      "@type": "Person",
      "@id": `${SITE.url}/#${member.id}`,
      name: team.members[member.id].name,
      jobTitle: team.members[member.id].role,
      sameAs: [member.linkedin],
    })),
  };

  return (
    <html lang={locale} className={`${siteFont.variable} h-full`}>
      <body className="min-h-full antialiased flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';if(!location.hash){window.scrollTo(0,0);}}",
          }}
        />
        <SiteMotion>{children}</SiteMotion>
        <ClarityAnalytics projectId={CLARITY_PROJECT_ID} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
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

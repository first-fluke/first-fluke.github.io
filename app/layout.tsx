import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
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
  name: "FIRST FLUKE",
  legalName: "퍼스트플루크 (FIRST FLUKE)",
  url: "https://firstfluke.com",
  logo: "https://firstfluke.com/logo.png",
  email: "our.first.fluke@gmail.com",
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FIRST FLUKE",
  url: "https://firstfluke.com",
  inLanguage: "ko-KR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full antialiased flex flex-col">
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

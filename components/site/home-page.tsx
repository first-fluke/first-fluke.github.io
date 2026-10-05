import { Header } from "@/components/site/header";
import { FloatingNav } from "@/components/site/floating-nav";
import { Hero } from "@/components/site/hero";
import { BrandMarquee } from "@/components/site/brand-marquee";
import { CompanyIntro } from "@/components/site/company-intro";
import { SolutionsGrid } from "@/components/site/solutions-grid";
import { OmaSection } from "@/components/site/oma-section";
import { TeamSection } from "@/components/site/team-section";
import { ContactSection } from "@/components/site/contact-section";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { ProductFaq } from "@/components/site/product-faq";
import type { Locale } from "@/lib/i18n/i18n.types";

const MASCOT_COVER = `data:image/webp;base64,${readFileSync("public/firstfluke-mascot-cover.webp").toString("base64")}`;

export function HomePage({ locale = "ko" }: { locale?: Locale }) {
  return (
    <>
      <Header />
      <FloatingNav />
      <main className="flex-1">
        <Hero mascotCover={MASCOT_COVER} />
        <BrandMarquee />
        <CompanyIntro />
        <OmaSection />
        <SolutionsGrid />
        <ProductFaq locale={locale} />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
import { readFileSync } from "node:fs";

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

export function HomePage() {
  return (
    <>
      <Header />
      <FloatingNav />
      <main className="flex-1">
        <Hero />
        <BrandMarquee />
        <CompanyIntro />
        <OmaSection />
        <SolutionsGrid />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

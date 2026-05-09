import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { CompanyIntro } from "@/components/site/company-intro";
import { SolutionsGrid } from "@/components/site/solutions-grid";
import { ContactSection } from "@/components/site/contact-section";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <CompanyIntro />
        <SolutionsGrid />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

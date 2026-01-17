import { PublicNavbar } from "@/components/landing/PublicNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AnimatedShowcase } from "@/components/landing/AnimatedShowcase";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <PublicNavbar />

      <main id="main-content">
        <HeroSection />
        <AnimatedShowcase />
        <FeaturesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

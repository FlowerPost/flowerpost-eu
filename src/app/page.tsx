// HeroSection (3D scroll-driven unboxing) is temporarily replaced by
// HeroVideoSection below — kept in the codebase, not deleted, swap back by
// restoring this import and the JSX usage further down.
// import { HeroSection } from "@/components/HeroSection";
import { HeroVideoSection } from "@/components/HeroVideoSection";
import { IntroStatement } from "@/components/IntroStatement";
import { StoryScene } from "@/components/StoryScene";
import { ProductScene } from "@/components/ProductScene";
import { LidReveal } from "@/components/LidReveal";
import { ConfiguratorTeaser } from "@/components/ConfiguratorTeaser";
import { TrustScene } from "@/components/TrustScene";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroVideoSection />
      <IntroStatement />
      <StoryScene />
      <ProductScene />
      <LidReveal />
      <ConfiguratorTeaser />
      <TrustScene />
      <Footer />
    </main>
  );
}

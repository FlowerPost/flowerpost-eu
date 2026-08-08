import { HeroSection } from "@/components/HeroSection";
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
      <HeroSection />
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

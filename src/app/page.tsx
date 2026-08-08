// Earlier Hero variants (3D scroll-driven unboxing, scroll-scrubbed video)
// are kept in the codebase, not deleted — swap back by restoring one of
// these imports and its JSX usage further down.
// import { HeroSection } from "@/components/HeroSection";
// import { HeroVideoSection } from "@/components/HeroVideoSection";
import { ScrollBoxReveal } from "@/components/ScrollBoxReveal";
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
      <ScrollBoxReveal />
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

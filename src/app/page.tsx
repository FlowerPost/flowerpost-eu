// Earlier Hero variants (3D scroll-driven unboxing, scroll-scrubbed video,
// standalone ScrollBoxReveal + LidReveal) are kept in the codebase, not
// deleted — swap back by restoring one of these imports and its JSX usage
// further down. HeroReveal merges ScrollBoxReveal's frame-sequence engine
// and LidReveal's phase/CTA structure into one continuous 3-phase scroll flow.
// import { HeroSection } from "@/components/HeroSection";
// import { HeroVideoSection } from "@/components/HeroVideoSection";
// import { ScrollBoxReveal } from "@/components/ScrollBoxReveal";
// import { LidReveal } from "@/components/LidReveal";
import { HeroReveal } from "@/components/HeroReveal";
import { IntroStatement } from "@/components/IntroStatement";
import { StoryScene } from "@/components/StoryScene";
import { ProductScene } from "@/components/ProductScene";
import { ConfiguratorTeaser } from "@/components/ConfiguratorTeaser";
import { TrustScene } from "@/components/TrustScene";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroReveal />
      <IntroStatement />
      <StoryScene />
      <ProductScene />
      <ConfiguratorTeaser />
      <TrustScene />
      <Footer />
    </main>
  );
}

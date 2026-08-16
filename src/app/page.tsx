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

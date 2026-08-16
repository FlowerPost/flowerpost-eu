import { HeroReveal } from "@/components/HeroReveal";
import { LogoSeam } from "@/components/LogoSeam";
import { IntroStatement } from "@/components/IntroStatement";
import { StoryScene } from "@/components/StoryScene";
import { ProductScene } from "@/components/ProductScene";
import { ReviewsTeaser } from "@/components/ReviewsTeaser";
import { TrustScene } from "@/components/TrustScene";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroReveal />
      <LogoSeam />
      <IntroStatement />
      <StoryScene />
      <ProductScene />
      <ReviewsTeaser />
      <TrustScene />
      <Footer />
    </main>
  );
}

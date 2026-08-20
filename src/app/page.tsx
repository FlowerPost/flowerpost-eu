import { HeroReveal } from "@/components/HeroReveal";
import { LogoSeam } from "@/components/LogoSeam";
import { IntroStatement } from "@/components/IntroStatement";
import { StoryScene } from "@/components/StoryScene";
import { VideoBand } from "@/components/VideoBand";
import { ProductScene } from "@/components/ProductScene";
import { VideoStrip } from "@/components/VideoStrip";
import { ReviewsTeaser } from "@/components/ReviewsTeaser";
import { TrustScene } from "@/components/TrustScene";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroReveal />
      <LogoSeam />
      <IntroStatement />
      <VideoBand />
      <StoryScene />
      <ProductScene />
      <VideoStrip />
      <ReviewsTeaser />
      <TrustScene />
      <Footer />
    </main>
  );
}

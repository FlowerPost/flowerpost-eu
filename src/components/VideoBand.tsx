import { AmbientVideo } from "@/components/AmbientVideo";

// Full-bleed ambient band. Masked top and bottom for the same reason the
// Hero canvas is: a video meeting the page background along a straight edge
// reads as a pasted-in rectangle, while a dissolve reads as one continuous
// scene. The overlay is a warm scrim, not a grey one, so the footage stays
// in the site's champagne/bordeaux family instead of going cold.
//
// The "Всяко стъбло подбрано на ръка" headline that used to overlay this
// clip moved to IntroStatement, under the CTA row — this is now pure
// ambient footage with no text competing with the roses.
export function VideoBand() {
  return (
    <section className="relative h-[78vh] w-full overflow-hidden md:h-[92vh]">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_82%,transparent_100%)]">
        <AmbientVideo
          src="/videos/roses-hanging.mp4"
          label="Рози, окачени с цветовете надолу"
          className="h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-champagne-sand)]/35 via-transparent to-[var(--color-champagne-sand)]/45"
          aria-hidden
        />
      </div>
    </section>
  );
}

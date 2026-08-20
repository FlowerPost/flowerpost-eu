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
//
// object-cover on the phone size and object-contain from md up — measured,
// not styled by feel. The clip is a portrait 720x1280 render. On a phone
// (375x812, this band at 78vh) cover only crops 5% of the frame, so it stays
// full-bleed there. On a 1440-wide desktop (band at 92vh) the same cover
// rule scales the source 1.98x and throws away 67% of its height — that's
// the "too close" crop being reported. From md, contain shows the whole
// clip at ~1:1 instead, letterboxed left/right; those bars are feathered on
// the video itself (not the wrapper) so the clip's own edges dissolve into
// the shared background instead of showing as a hard rectangle — the same
// problem the Hero frame and the logo halo both had before.
const CONTAIN_FROM_MD =
  "md:object-contain md:[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] md:[mask-composite:intersect]";

export function VideoBand() {
  return (
    <section className="relative h-[78vh] w-full overflow-hidden md:h-[92vh]">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_82%,transparent_100%)]">
        <AmbientVideo
          src="/videos/roses-hanging.mp4"
          label="Рози, окачени с цветовете надолу"
          className={`h-full w-full object-cover ${CONTAIN_FROM_MD}`}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-champagne-sand)]/35 via-transparent to-[var(--color-champagne-sand)]/45"
          aria-hidden
        />
      </div>
    </section>
  );
}

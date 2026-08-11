import type { Metadata } from "next";
import Link from "next/link";

// ============================================================================
// FROZEN ROUTE — do not rename, move, or delete this page or its URL path.
//
// This page is the scan target of a QR code printed on 500 physical
// FLOWERPOST provenance cards (inserted in every box). The QR image encodes
// https://flowerpost.eu/otzivi literally, pixel by pixel — if this route's
// path ever changes, every printed card breaks permanently with no way to
// reprint mid-run. See PROJECT_VISION.md → "Замразени routes" for the same
// warning at the doctrine level.
// ============================================================================

const GOOGLE_REVIEW_URL =
  // TODO: replace with the real Google Business review link once the
  // FLOWERPOST Google Business profile exists — format is typically
  // https://g.page/r/XXXXXXXX/review or https://maps.app.goo.gl/XXXXXXXX.
  // This search-query fallback still takes the customer somewhere useful
  // in the meantime, rather than a dead "#" link on a printed card.
  "https://www.google.com/search?q=Flowerpost+Bulgaria+reviews";

export const metadata: Metadata = {
  title: "Отзиви — FLOWERPOST",
  description: "Благодарим, че отвори кутията. Сподели своя опит с FLOWERPOST.",
};

export default function OtziviPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-8 py-32 text-center md:py-48">
      <span className="tf-mono mb-8 text-gold">Flowerpost · Bulgaria</span>

      <h1 className="tf-display mb-8 max-w-2xl text-ink">
        Благодарим,
        <br />
        <span className="text-bordeaux">че отвори кутията.</span>
      </h1>

      <p className="tf-body mb-12 max-w-md">
        Ще се радваме да чуем какво почувства. Отзивът ти отнема минута и
        помага на следващия човек да открие ритуала.
      </p>

      <a
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-bordeaux"
      >
        Остави отзив в Google
      </a>

      <Link href="/" className="tf-mono mt-16 text-stone transition-colors hover:text-gold">
        ← Обратно към flowerpost.eu
      </Link>
    </main>
  );
}

import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SiteBackground } from "@/components/SiteBackground";
import "./globals.css";

// Single site-wide typeface — replaces the previous Playfair/Manrope pair.
// Bound to --font-playfair; globals.css aliases --font-space-mono to the
// same variable, so every existing .tf-* class and component reference
// (including ProductScene's inline font-[var(--font-space-mono)]) resolves
// to Montserrat with no other file to touch.
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["500"],
  variable: "--font-playfair",
  display: "swap",
});

// Scoped to the SVG brand mark only — the site copy stays Montserrat. The
// wordmark is a high-contrast didone-style serif, which Montserrat cannot
// stand in for; this is a logo asset, not body typography.
const logoSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-logo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flowerpost.eu"),
  title: "FLOWERPOST — Bulgaria",
  description:
    "Тих луксозен ритуал на цветята. Рози и сезонни цветя, доставени от сърцето на България.",
  openGraph: {
    title: "FLOWERPOST",
    description: "Тих луксозен ритуал на цветята от България.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bg"
      className={`${montserrat.variable} ${logoSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col text-ink"
        suppressHydrationWarning
      >
        <SiteBackground />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

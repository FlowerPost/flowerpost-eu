import type { Metadata } from "next";
import { Playfair_Display, Space_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
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
      className={`${playfair.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-ivory text-ink"
        suppressHydrationWarning
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "FlowerPost | Р РёС‚СѓР°Р»СЉС‚ РЅР° С†РІРµС‚СЏС‚Р°",
  description: "РџСЂРµРјРёСѓРј Р°Р±РѕРЅР°РјРµРЅС‚ Р·Р° СЃРІРµР¶Рё С†РІРµС‚СЏ РѕС‚ Р±СЉР»РіР°СЂСЃРєРё С„РµСЂРјРё.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body className={`${playfair.variable} ${spaceMono.variable} font-serif bg-sand-50 text-terra-900`}>
        {children}
      </body>
    </html>
  );
}

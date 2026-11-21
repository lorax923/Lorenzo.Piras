import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* Font già collegati alle variabili del tuo globals.css. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* Titolo e descrizione del sito. */
export const metadata: Metadata = {
  title: "Lorenzo Piras — Bespoke Web Design",
  description:
    "Crafting Unconventional, Bespoke & Avant-Garde Web Experiences. Web design su misura, identità visive distintive e animazioni immersive.",
};

/* Struttura condivisa delle pagine. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
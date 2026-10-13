import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agentic Dating",
  description:
    "Agents read LinkedIn & Instagram, date on your behalf, and rank your best matches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} font-sans antialiased`}>
        <div className="bg-atmosphere" aria-hidden />
        <div className="bg-noise" aria-hidden />
        <SiteHeader />
        <main className="page-enter mx-auto max-w-6xl px-4 py-8 md:py-12">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 pb-12 pt-4 text-center text-xs text-white/35">
          AgenticDating · LinkedIn + Instagram only · Agents date on your behalf
        </footer>
      </body>
    </html>
  );
}

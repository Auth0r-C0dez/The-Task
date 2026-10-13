import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });

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
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-display text-2xl tracking-tight">
              Agentic<span className="text-blush">Dating</span>
            </Link>
            <nav className="flex gap-4 text-sm text-white/80">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/people" className="hover:text-white">
                People
              </Link>
              <Link href="/rankings" className="hover:text-white">
                Rankings
              </Link>
              <Link href="/dates" className="hover:text-white">
                Agent dates
              </Link>
              <Link href="/how-it-works" className="hover:text-white">
                How it works
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

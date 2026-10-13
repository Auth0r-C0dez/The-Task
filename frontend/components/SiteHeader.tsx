"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/people", label: "People" },
  { href: "/rankings", label: "Rankings" },
  { href: "/dates", label: "Agent dates" },
  { href: "/how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight transition hover:opacity-90"
        >
          Agentic<span className="text-blush">Dating</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${active ? "!text-white after:!scale-x-100" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/#try" className="btn-primary !px-4 !py-2 text-sm md:hidden">
          Try
        </Link>
        <Link
          href="/#try"
          className="btn-ghost !hidden !px-4 !py-2 text-sm md:!inline-flex"
        >
          Try it
        </Link>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-white/5 px-4 py-2 text-xs md:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link whitespace-nowrap">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

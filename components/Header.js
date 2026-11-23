"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { products } from "@/data/products";
import Icon from "./Icons";

const nav = [
  { href: "/", label: "Home" },
  { href: "/products/", label: "Products" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 2 20 7v10l-8 5-8-5V7l8-5Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>
      <span className={`font-display text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-navy-900"}`}>
        {site.shortName}
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, "")));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ${
        scrolled || open
          ? "border-white/60 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:bg-white/70 md:backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                isActive(n.href) ? "text-brand" : "text-slate-600 hover:text-navy-900"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-navy-900">
            <Icon name="phone" className="h-4 w-4" /> {site.phone}
          </a>
          <Link href="/contact/" className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:shadow-lg">
            Get a Quote
          </Link>
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md text-navy-900 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200/70 md:hidden">
          <nav className="container-x flex flex-col py-3" aria-label="Mobile">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-md px-2 py-3 text-base font-semibold ${isActive(n.href) ? "text-brand" : "text-slate-700"}`}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-1 border-t border-slate-100 pt-2">
              {products.map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}/`} className="block px-2 py-2 text-sm text-slate-500">
                  {p.name}
                </Link>
              ))}
            </div>
            <Link href="/contact/" className="mt-3 rounded-lg bg-navy-900 px-4 py-3 text-center font-semibold text-white">
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

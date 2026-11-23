import Link from "next/link";
import { site } from "@/data/site";
import { themes } from "@/data/products";
import ProductVisual from "./ProductVisual";
import Icon, { WhatsAppIcon } from "./Icons";
import Tilt from "./Tilt";
import Gallery from "./Gallery";

export function SectionHeading({ eyebrow, title, text, center = false, light = false }) {
  return (
    <div className={`reveal max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow ${light ? "!text-brand-light" : ""}`}>{eyebrow}</p>}
      <h2 className={`mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl ${light ? "text-white" : "text-navy-900"}`}>
        {title}
      </h2>
      {text && <p className={`mt-3 text-base leading-relaxed sm:text-lg ${light ? "text-slate-300" : "text-slate-600"}`}>{text}</p>}
    </div>
  );
}

export function ProductCard({ product }) {
  const t = themes[product.theme];
  return (
    <div className="reveal h-full">
    <Tilt className="h-full">
    <Link
      href={`/products/${product.slug}/`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-slate-300/60"
    >
      <span className="tilt-glare pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        {product.images?.length ? (
          <Gallery images={product.images} aspect="aspect-[16/10]" accent={t.accent} />
        ) : (
          <div className="aspect-[16/10] overflow-hidden">
            <ProductVisual product={product} className="h-full w-full" />
          </div>
        )}
        <span
          className="pointer-events-none absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
          style={{ background: t.accent }}
        >
          {t.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-navy-900">{product.name}</h3>
          <span className="shrink-0 text-sm font-bold" style={{ color: t.accent }}>{product.grade}</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">{product.chemicalName.split(",")[0]} · {product.formula}</p>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-600">{product.short}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
          <div><dt className="text-slate-400">HS Code</dt><dd className="font-semibold text-slate-800">{product.hsCode}</dd></div>
          <div><dt className="text-slate-400">CAS No.</dt><dd className="font-semibold text-slate-800">{product.casNo}</dd></div>
        </dl>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
          View specifications <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
    </Tilt>
    </div>
  );
}

export function PageHeader({ eyebrow, title, text, children }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="container-x relative pb-14 pt-28 sm:pb-20 sm:pt-36">
        {children}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">{text}</p>}
      </div>
    </section>
  );
}

export function CTABand() {
  const text = encodeURIComponent(`Hello ${site.shortName}, I would like a quote.`);
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <div className="reveal relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-600 to-emerald-500 px-6 py-14 text-center shadow-xl shadow-teal-600/20 sm:px-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-emerald-300/20 blur-2xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Need a bulk quote?</h2>
            <p className="mx-auto mt-3 max-w-xl text-teal-50">
              Tell us the product, quantity and delivery location — we&apos;ll send pricing, COA and dispatch timelines.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact/" className="rounded-full bg-white px-7 py-3 font-semibold text-teal-800 shadow-md transition hover:bg-teal-50">
                Request a Quote
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${text}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Decorative banner illustration: warehouse racks with stacked bags & drums.
export function HeroArt({ className = "" }) {
  const bag = (x, y, c) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
      <path d="M2 4 Q30 0 58 4 L60 34 Q30 38 0 34 Z" fill="#f1f5f9" stroke="#cbd5e1" />
      <rect x="16" y="12" width="28" height="14" rx="2" fill={c} />
    </g>
  );
  const drum = (x, y, c) => (
    <g key={`d${x}-${y}`} transform={`translate(${x} ${y})`}>
      <rect x="0" y="6" width="44" height="62" rx="4" fill={c} />
      <ellipse cx="22" cy="6" rx="22" ry="6" fill="#ffffff" opacity="0.35" />
      <rect x="0" y="24" width="44" height="3" fill="#000" opacity="0.15" />
      <rect x="0" y="46" width="44" height="3" fill="#000" opacity="0.15" />
    </g>
  );
  const colors = ["#0284c7", "#ea580c", "#16a34a"];
  return (
    <svg viewBox="0 0 520 420" className={className} role="img" aria-label="Warehouse with stacked chemical bags and drums">
      <defs>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b3a6b" />
          <stop offset="1" stopColor="#0b1b36" />
        </linearGradient>
      </defs>
      <rect x="0" y="330" width="520" height="90" fill="url(#floor)" opacity="0.6" rx="12" />
      {/* rack */}
      <g stroke="#64748b" strokeWidth="5">
        <line x1="40" y1="40" x2="40" y2="340" />
        <line x1="300" y1="40" x2="300" y2="340" />
      </g>
      <g stroke="#94a3b8" strokeWidth="6">
        <line x1="34" y1="120" x2="306" y2="120" />
        <line x1="34" y1="230" x2="306" y2="230" />
        <line x1="34" y1="340" x2="306" y2="340" />
      </g>
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => bag(50 + col * 62, 82 + row * 110, colors[(col + row) % 3]))
      )}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => bag(50 + col * 62, 50 + row * 110, colors[(col + row + 1) % 3]))
      )}
      {/* drums */}
      {drum(340, 272, "#1e40af")}
      {drum(392, 272, "#0e7c86")}
      {drum(444, 272, "#1e40af")}
      {drum(366, 204, "#0e7c86")}
      {drum(418, 204, "#1e40af")}
      {/* lab flask badge */}
      <g transform="translate(390 70)">
        <circle r="56" fill="#14b8a6" opacity="0.15" />
        <circle r="40" fill="#0b1b36" stroke="#14b8a6" strokeWidth="2" />
        <path d="M-8 -20h16M-6 -20v12L-18 14a3 3 0 0 0 2.6 4.5h30.8A3 3 0 0 0 18 14L6 -8v-12" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" />
        <path d="M-12 6h24l5 9H-17Z" fill="#14b8a6" />
      </g>
    </svg>
  );
}

import Link from "next/link";
import { site, stats, industries, whyUs } from "@/data/site";
import { products, themes } from "@/data/products";
import Icon from "@/components/Icons";
import { SectionHeading, ProductCard, CTABand } from "@/components/Sections";
import Hero3D from "@/components/Hero3D";

const whyIcons = ["shield", "box", "truck", "tag"];

export default function Home() {
  return (
    <>
      {/* HERO — centred text, 3D molecules & glassware float around it */}
      <Hero3D className="min-h-[680px] sm:min-h-[760px] lg:min-h-screen">
        <div data-hero-fade className="container-x flex min-h-[inherit] flex-col items-center justify-center pb-32 pt-28 text-center sm:pb-24 sm:pt-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" /> Industrial &amp; Food Grade Chemicals
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Pure Chemicals.
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Reliable Supply.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{site.description}</p>
          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/contact/"
              className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:shadow-xl hover:shadow-teal-600/30"
            >
              Request a Quote
            </Link>
            <Link
              href="/products/"
              className="rounded-full border border-slate-300 bg-white/90 px-8 py-3.5 font-semibold text-slate-800 transition hover:border-teal-500 hover:text-teal-700"
            >
              View Products
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}/`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: themes[p.theme].accent }} />
                {p.name}
                <span className="text-slate-400">{p.grade}</span>
              </Link>
            ))}
          </div>
        </div>
      </Hero3D>

      {/* STATS — floating card */}
      <section className="relative z-10 -mt-12">
        <div className="container-x">
          <div className="grid grid-cols-2 rounded-2xl border border-slate-100 bg-white py-4 shadow-xl shadow-teal-900/5 md:grid-cols-4 md:divide-x md:divide-slate-100">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-3 text-center">
                <p className="font-display text-2xl font-extrabold text-teal-700 sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Our Products"
            title="Three essentials. One dependable supplier."
            text="High-purity chemicals with clear specifications, HS codes and safe packaging — ready for domestic and export orders."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="bg-gradient-to-b from-teal-50/70 to-white py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Industries We Serve"
            title="Trusted across manufacturing sectors"
            text="From textile mills and soap units to beverage plants — our products go where quality matters."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((i) => (
              <div key={i.key} className="reveal group rounded-2xl border border-teal-100 bg-white p-6 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-900/5">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20 transition group-hover:scale-110">
                  <Icon name={i.key} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold text-slate-900">{i.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{i.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARALLAX PHOTO BAND */}
      <section className="relative isolate overflow-hidden bg-teal-950 sm:flex sm:min-h-[520px] sm:items-center sm:py-20">
        {/* mobile: show the whole photo (no side cropping), text below */}
        <div className="relative aspect-[1600/873] sm:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/products/citric-acid-monohydrate-3.webp"
            alt="Chemical processing plant and warehouse"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-teal-950 to-transparent" />
        </div>
        {/* tablet / desktop: full-bleed parallax background */}
        <div data-parallax="-0.25" className="absolute inset-x-0 -top-[25%] -z-10 hidden h-[150%] sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/products/citric-acid-monohydrate-3.webp" alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-teal-950/90 via-teal-900/70 to-teal-900/20 sm:block" />
        <div className="container-x pb-12 pt-6 sm:py-0">
          <div className="max-w-xl text-white">
            <p className="reveal eyebrow !text-teal-300">From Our Warehouse To Your Factory</p>
            <h2 className="reveal mt-3 font-display text-3xl font-extrabold leading-tight sm:text-5xl">Stocked, packed and ready to dispatch.</h2>
            <p className="reveal mt-4 text-lg text-teal-50/90">
              Ready stock, moisture-proof packing and batch-wise COA — so your production line never waits.
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-3">
              <Link href="/contact/" className="rounded-full bg-white px-7 py-3 font-semibold text-teal-800 shadow-lg transition hover:bg-teal-50">
                Request a Quote
              </Link>
              <Link href="/about/" className="rounded-full border border-white/40 px-7 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10">
                About {site.shortName}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Why Choose Us" title="Quality you can verify, service you can rely on" text="We keep our range focused so every order gets the same consistency, documentation and on-time dispatch." />
            <Link href="/about/" className="reveal mt-6 inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:text-teal-900">
              More about us <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyUs.map((w, i) => (
              <div key={w.title} className="reveal rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-100 text-teal-700">
                  <Icon name={whyIcons[i]} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold text-slate-900">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-gradient-to-b from-white to-teal-50/60 py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading center eyebrow="How It Works" title="From enquiry to delivery in 4 steps" />
          <ol className="relative mt-14 grid gap-8 md:grid-cols-4 md:gap-6">
            <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-200 md:block" />
            {[
              ["Share Requirement", "Product, grade, quantity and delivery location."],
              ["Get Quote & COA", "Pricing, specification sheet and lead time."],
              ["Confirm Order", "Simple PO / advance with GST invoice."],
              ["Dispatch", "Sealed, labelled bags with transport tracking."],
            ].map(([t, d], i) => (
              <li key={t} className="reveal relative text-center">
                <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-white font-display text-xl font-extrabold text-teal-600 shadow-md ring-4 ring-teal-50">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-bold text-slate-900">{t}</h3>
                <p className="mx-auto mt-1 max-w-[16rem] text-sm text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTABand />
    </>
  );
}

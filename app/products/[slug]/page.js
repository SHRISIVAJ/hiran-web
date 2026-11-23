import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, themes } from "@/data/products";
import { industries, site } from "@/data/site";
import ProductVisual from "@/components/ProductVisual";
import Gallery from "@/components/Gallery";
import QuoteForm from "@/components/QuoteForm";
import Icon, { WhatsAppIcon } from "@/components/Icons";
import { ProductCard } from "@/components/Sections";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} ${p.grade} — Supplier`,
    description: `${p.name} (${p.formula}, ${p.grade}) — HS Code ${p.hsCode}, CAS ${p.casNo}. ${p.short}`,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const t = themes[p.theme];
  const apps = industries.filter((i) => p.applications.includes(i.key));
  const others = products.filter((x) => x.slug !== p.slug);
  const wa = encodeURIComponent(`Hello ${site.shortName}, I need a quote for ${p.name} (${p.grade}).`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.name} ${p.grade}`,
    description: p.overview,
    category: "Industrial Chemicals",
    brand: { "@type": "Brand", name: site.name },
    additionalProperty: [
      { "@type": "PropertyValue", name: "HS Code", value: p.hsCode },
      { "@type": "PropertyValue", name: "CAS Number", value: p.casNo },
      { "@type": "PropertyValue", name: "Chemical Formula", value: p.formula },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* HERO */}
      <section className="border-b border-slate-200" style={{ background: `linear-gradient(180deg, ${t.soft} 0%, #fff 100%)` }}>
        <div className="container-x pb-6 pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <Link href="/" className="hover:text-navy-900">Home</Link> /{" "}
            <Link href="/products/" className="hover:text-navy-900">Products</Link> /{" "}
            <span className="text-slate-800">{p.name}</span>
          </nav>
        </div>
        <div className="container-x grid items-start gap-10 pb-14 lg:grid-cols-2">
          <div className="reveal">
            {p.images?.length ? (
              <Gallery
                images={p.images}
                thumbs
                priority
                accent={t.accent}
                aspect="aspect-[16/10] rounded-3xl shadow-xl shadow-slate-300/50"
              />
            ) : (
              <div className="overflow-hidden rounded-3xl shadow-xl shadow-slate-200">
                <ProductVisual product={p} className="aspect-[10/9] h-full w-full" />
              </div>
            )}
          </div>
          <div>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: t.accent }}>
              {t.label}
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">{p.name}</h1>
            <p className="mt-2 text-xl font-bold" style={{ color: t.accent }}>{p.grade}</p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{p.overview}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Formula", p.formula],
                ["HS Code", p.hsCode],
                ["CAS No.", p.casNo],
                ["Form", p.form.split(" ").slice(-2).join(" ")],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-200 bg-white p-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{k}</dt>
                  <dd className="mt-1 font-bold text-navy-900 first-letter:uppercase">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className="rounded-lg bg-navy-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-navy-700">
                Request a Quote
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-navy-900 transition hover:border-[#25D366] hover:text-[#128C7E]"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SPECS + SIDE */}
      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-extrabold text-navy-900">Technical Specifications</h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-[15px]">
                <thead style={{ background: t.deep }} className="text-white">
                  <tr><th className="px-4 py-3 font-semibold">Parameter</th><th className="px-4 py-3 font-semibold">Specification</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white"><td className="px-4 py-3 text-slate-600">Chemical Name</td><td className="px-4 py-3 font-semibold text-slate-900">{p.chemicalName}</td></tr>
                  {p.specs.map(([k, v]) => (
                    <tr key={k} className="odd:bg-slate-50 even:bg-white">
                      <td className="px-4 py-3 text-slate-600">{k}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">Typical values. Actual results are provided on the batch Certificate of Analysis (COA).</p>

            <h2 className="mt-12 font-display text-2xl font-extrabold text-navy-900">Applications</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {apps.map((a) => (
                <div key={a.key} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg" style={{ background: t.soft, color: t.accent }}>
                    <Icon name={a.key} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-bold text-navy-900">{a.name}</h3>
                    <p className="text-sm text-slate-600">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="flex items-center gap-2 font-bold text-navy-900"><Icon name="box" className="h-5 w-5 text-brand" /> Packaging</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {p.packaging.map((x) => <li key={x} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{x}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="flex items-center gap-2 font-bold text-navy-900"><Icon name="flask" className="h-5 w-5 text-brand" /> Storage</h3>
              <p className="mt-3 text-sm text-slate-600">{p.storage}</p>
            </div>
            <div className={`rounded-2xl border p-6 ${p.hazard ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
              <h3 className={`flex items-center gap-2 font-bold ${p.hazard ? "text-red-800" : "text-amber-800"}`}>
                <Icon name="warning" className="h-5 w-5" /> Safety &amp; Handling
              </h3>
              <p className={`mt-3 text-sm ${p.hazard ? "text-red-800" : "text-amber-900"}`}>{p.safety}</p>
            </div>
            <div className="rounded-2xl bg-navy-900 p-6 text-white">
              <h3 className="flex items-center gap-2 font-bold"><Icon name="file" className="h-5 w-5 text-brand-light" /> Documents</h3>
              <p className="mt-2 text-sm text-slate-300">TDS, MSDS and COA available on request with every quotation.</p>
              <a href="#quote" className="mt-4 inline-block text-sm font-semibold text-brand-light hover:text-white">Request documents →</a>
            </div>
          </aside>
        </div>
      </section>

      {/* QUOTE */}
      <section id="quote" className="scroll-mt-20 bg-slate-50 py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="eyebrow">Get Pricing</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-navy-900">Request a quote for {p.name}</h2>
            <p className="mt-3 text-slate-600">Share your quantity and delivery location. We&apos;ll reply with price, lead time and COA — usually within one business day.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3 sm:p-8">
            <QuoteForm defaultProduct={`${p.name} (${p.grade})`} />
          </div>
        </div>
      </section>

      {/* OTHER PRODUCTS */}
      <section className="py-14 sm:py-20">
        <div className="container-x">
          <h2 className="font-display text-2xl font-extrabold text-navy-900">Other products</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {others.map((o) => <ProductCard key={o.slug} product={o} />)}
          </div>
        </div>
      </section>
    </>
  );
}

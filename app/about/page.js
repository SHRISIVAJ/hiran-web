import { site, whyUs, industries } from "@/data/site";
import { PageHeader, SectionHeading, CTABand } from "@/components/Sections";
import Icon from "@/components/Icons";

export const metadata = {
  title: "About Us",
  description: `${site.name} supplies industrial and food grade chemicals with consistent quality, safe packing and on-time delivery.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About Us" title={`About ${site.name}`} text={site.tagline} />

      <section className="py-16 sm:py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal space-y-4 text-[17px] leading-relaxed text-slate-600">
            <p className="eyebrow">Who We Are</p>
            <h2 className="font-display text-3xl font-extrabold text-navy-900">A focused supplier for essential chemicals</h2>
            {/* PLACEHOLDER copy — replace with the client's story */}
            <p>
              {site.founded ? `Since ${site.founded}, ` : ""}{site.name} supplies manufacturers with dependable industrial chemicals. We keep our
              range focused — Soda Ash Light, Caustic Soda Flakes and Citric Acid Monohydrate — so we can guarantee
              consistent quality, ready stock and quick dispatch.
            </p>
            <p>
              We work with textile processors, soap and detergent makers, glass units, water-treatment plants and food &amp;
              beverage companies. Every consignment is packed in moisture-proof bags and supported with a Certificate of Analysis.
            </p>
            {(site.gst || site.iec) && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                {site.gst && <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-400">GSTIN</p><p className="font-semibold text-navy-900">{site.gst}</p></div>}
                {site.iec && <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-400">IEC</p><p className="font-semibold text-navy-900">{site.iec}</p></div>}
              </div>
            )}
          </div>
          <div className="reveal overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero-3d.webp" alt="Chemical drums and bagged products ready for dispatch" className="w-full" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading center eyebrow="Our Commitment" title="What we promise every customer" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w) => (
              <div key={w.title} className="reveal rounded-2xl bg-white p-6 shadow-sm">
                <Icon name="check" className="h-6 w-6 text-brand" />
                <h3 className="mt-3 font-bold text-navy-900">{w.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <h2 className="text-center font-display text-2xl font-extrabold text-navy-900">Industries we serve</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {industries.map((i) => (
              <span key={i.key} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                <Icon name={i.key} className="h-4 w-4 text-brand" /> {i.name}
              </span>
            ))}
          </div>
        </div>
      </section>
      <CTABand />
    </>
  );
}

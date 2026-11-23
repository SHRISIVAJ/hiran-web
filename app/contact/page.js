import { site } from "@/data/site";
import { PageHeader } from "@/components/Sections";
import QuoteForm from "@/components/QuoteForm";
import Icon, { WhatsAppIcon } from "@/components/Icons";

export const metadata = {
  title: "Contact & Get a Quote",
  description: `Request a quote for Soda Ash Light, Caustic Soda Flakes or Citric Acid Monohydrate from ${site.name}.`,
};

export default function ContactPage() {
  const cards = [
    { icon: "phone", label: "Call us", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: "pin", label: "Office", value: site.address },
    { icon: "clock", label: "Working hours", value: site.hours },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get a quote in one business day"
        text="Tell us what you need — product, quantity and delivery location — and we'll send pricing with COA."
      />
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {cards.map((c) => {
              const inner = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">{c.label}</span>
                    <span className="block font-semibold text-navy-900">{c.value}</span>
                  </span>
                </>
              );
              return c.href ? (
                <a key={c.label} href={c.href} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-brand/40">{inner}</a>
              ) : (
                <div key={c.label} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">{inner}</div>
              );
            })}
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] p-4 font-semibold text-white transition hover:bg-[#1fb457]"
            >
              <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h2 className="mb-6 font-display text-2xl font-extrabold text-navy-900">Request a Quote</h2>
            <QuoteForm />
          </div>
        </div>
      </section>
      <section className="pb-16">
        <div className="container-x">
          <iframe
            title="Office location map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
            className="h-80 w-full rounded-2xl border border-slate-200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

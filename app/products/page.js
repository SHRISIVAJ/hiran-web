import { products } from "@/data/products";
import { PageHeader, ProductCard, CTABand } from "@/components/Sections";

export const metadata = {
  title: "Products",
  description: "Soda Ash Light 99.2%, Caustic Soda Flakes 99% and Citric Acid Monohydrate Food Grade — specifications, HS codes and packaging.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Our Chemical Range"
        text="Specifications, HS codes, CAS numbers and packaging details for every product we supply."
      />
      <section className="bg-slate-50 py-16">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <h2 className="font-display text-2xl font-extrabold text-navy-900">Quick comparison</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-navy-900 text-white">
                <tr>
                  {["Product", "Grade", "Formula", "HS Code", "CAS No.", "Form"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((p) => (
                  <tr key={p.slug} className="odd:bg-white even:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-navy-900">
                      <a href={`/products/${p.slug}/`} className="hover:text-brand">{p.name}</a>
                    </td>
                    <td className="px-4 py-3">{p.grade}</td>
                    <td className="px-4 py-3">{p.formula}</td>
                    <td className="px-4 py-3 font-mono">{p.hsCode}</td>
                    <td className="px-4 py-3 font-mono">{p.casNo}</td>
                    <td className="px-4 py-3">{p.form}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <CTABand />
    </>
  );
}

import Link from "next/link";
import { site } from "@/data/site";
import { products } from "@/data/products";
import { Logo } from "./Header";
import Icon from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed text-slate-400">{site.description}</p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Products</h3>
          <ul className="space-y-2.5 text-sm">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}/`} className="hover:text-white">
                  {p.name} <span className="text-slate-500">· {p.grade}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Company</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about/" className="hover:text-white">About Us</Link></li>
            <li><Link href="/products/" className="hover:text-white">All Products</Link></li>
            <li><Link href="/contact/" className="hover:text-white">Request a Quote</Link></li>
          </ul>
          <dl className="mt-5 space-y-1 text-xs text-slate-500">
            {site.gst && <div>GSTIN: {site.gst}</div>}
            {site.iec && <div>IEC: {site.iec}</div>}
          </dl>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />{site.address}</li>
            <li><a className="flex gap-2.5 hover:text-white" href={`tel:${site.phone.replace(/\s/g, "")}`}><Icon name="phone" className="h-4 w-4 text-brand-light" />{site.phone}</a></li>
            <li><a className="flex gap-2.5 hover:text-white" href={`mailto:${site.email}`}><Icon name="mail" className="h-4 w-4 text-brand-light" />{site.email}</a></li>
            <li className="flex gap-2.5"><Icon name="clock" className="h-4 w-4 text-brand-light" />{site.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Specifications are indicative. Refer to the batch COA for actual values.</p>
        </div>
      </div>
    </footer>
  );
}

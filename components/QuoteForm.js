"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { products } from "@/data/products";

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function QuoteForm({ defaultProduct = "" }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form));
    if (d.botcheck) return;

    // Option A: email via Web3Forms when a key is configured
    if (site.web3formsKey) {
      setStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: site.web3formsKey,
            subject: `New quote request — ${d.product}`,
            from_name: site.name + " Website",
            ...d,
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        setStatus("sent");
        form.reset();
      } catch {
        setStatus("error");
      }
      return;
    }

    // Option B (default): open WhatsApp with the enquiry pre-filled
    const msg = [
      `*Quote Request — ${site.shortName} website*`,
      `Name: ${d.name}`,
      d.company && `Company: ${d.company}`,
      `Phone: ${d.phone}`,
      d.email && `Email: ${d.email}`,
      `Product: ${d.product}`,
      d.quantity && `Quantity: ${d.quantity}`,
      d.city && `Delivery to: ${d.city}`,
      d.message && `Message: ${d.message}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-display text-lg font-bold text-emerald-800">Thank you! Your enquiry is on its way.</p>
        <p className="mt-1 text-sm text-emerald-700">Our team will get back to you within one business day.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-4 text-sm font-semibold text-emerald-800 underline">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="space-y-1.5">
        <span className="text-sm font-semibold text-slate-700">Full name *</span>
        <input name="name" required className={field} placeholder="Your name" autoComplete="name" />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold text-slate-700">Company</span>
        <input name="company" className={field} placeholder="Company name" autoComplete="organization" />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold text-slate-700">Phone / WhatsApp *</span>
        <input name="phone" required type="tel" className={field} placeholder="+91" autoComplete="tel" />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold text-slate-700">Email</span>
        <input name="email" type="email" className={field} placeholder="you@company.com" autoComplete="email" />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold text-slate-700">Product *</span>
        <select name="product" required defaultValue={defaultProduct} className={field}>
          <option value="" disabled>Select a product</option>
          {products.map((p) => (
            <option key={p.slug} value={`${p.name} (${p.grade})`}>{p.name} — {p.grade}</option>
          ))}
          <option value="Multiple products">Multiple products</option>
        </select>
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold text-slate-700">Quantity</span>
        <input name="quantity" className={field} placeholder="e.g. 5 MT / 200 bags" />
      </label>
      <label className="space-y-1.5 sm:col-span-2">
        <span className="text-sm font-semibold text-slate-700">Delivery city / port</span>
        <input name="city" className={field} placeholder="City, State or Port" />
      </label>
      <label className="space-y-1.5 sm:col-span-2">
        <span className="text-sm font-semibold text-slate-700">Requirements</span>
        <textarea name="message" rows={4} className={field} placeholder="Grade, packing, delivery timeline, documents needed…" />
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          {site.web3formsKey ? "We reply within one business day." : "Submitting opens WhatsApp with your enquiry pre-filled."}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-navy-800 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Request Quote"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600 sm:col-span-2">Something went wrong. Please call or WhatsApp us directly.</p>
      )}
    </form>
  );
}

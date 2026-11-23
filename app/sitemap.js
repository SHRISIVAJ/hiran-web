import { site } from "@/data/site";
import { products } from "@/data/products";

export const dynamic = "force-static";

export default function sitemap() {
  const pages = ["", "/products/", "/about/", "/contact/", ...products.map((p) => `/products/${p.slug}/`)];
  return pages.map((p) => ({ url: `${site.url}${p || "/"}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.8 }));
}

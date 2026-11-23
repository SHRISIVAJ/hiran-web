// ============================================================
//  COMPANY DETAILS — edit this one file when the client sends
//  real details. Everything on the website reads from here.
// ============================================================

export const site = {
  name: "Teena",
  shortName: "Teena",
  tagline: "Industrial & Food Grade Chemicals — Supplied Right.",
  description:
    "Trusted supplier of Soda Ash Light, Caustic Soda Flakes and Citric Acid Monohydrate for textile, detergent, glass, water treatment and food industries.",
  url: "https://www.example.com", // PLACEHOLDER domain
  phone: "+91 98765 43210", // PLACEHOLDER
  whatsapp: "919876543210", // PLACEHOLDER — country code + number, no "+" or spaces
  email: "sales@example.com", // PLACEHOLDER
  address: "Kerala, India", // PLACEHOLDER — add full street address
  mapQuery: "Kerala, India", // used for the Google Map embed
  hours: "Mon – Sat, 9:30 AM – 6:30 PM",
  gst: "32XXXXXXXXXXXXX", // PLACEHOLDER (32 = Kerala)
  iec: "XXXXXXXXXX", // PLACEHOLDER (Import Export Code)
  founded: "2015", // PLACEHOLDER

  // Optional: Web3Forms access key (free at web3forms.com).
  // If empty, the quote form opens WhatsApp with the enquiry pre-filled.
  web3formsKey: "",

  // Optional: drop a real banner photo in /public/images and put its path here,
  // e.g. "/images/hero.jpg". Empty = designed SVG banner.
  heroImage: "",
};

export const stats = [
  { value: "3", label: "Core Products" },
  { value: "25 kg", label: "Standard Bag Packing" },
  { value: "PAN India", label: "Delivery" },
  { value: "COA", label: "With Every Batch" },
];

export const industries = [
  { key: "textile", name: "Textile & Dyeing", text: "Scouring, mercerising, bleaching and dye fixing." },
  { key: "detergent", name: "Soap & Detergent", text: "Saponification and washing-powder formulation." },
  { key: "glass", name: "Glass", text: "Primary flux for container and flat glass." },
  { key: "water", name: "Water Treatment", text: "pH correction and water softening." },
  { key: "food", name: "Food & Beverage", text: "Acidulant and preservative (E330)." },
  { key: "pharma", name: "Pharma & Cosmetics", text: "Effervescent tablets, syrups and pH buffers." },
  { key: "paper", name: "Paper & Pulp", text: "Pulping and bleaching processes." },
  { key: "cleaning", name: "Industrial Cleaning", text: "Degreasing, descaling and CIP cleaning." },
];

export const whyUs = [
  { title: "Consistent Quality", text: "Every batch is checked against spec and shipped with a Certificate of Analysis." },
  { title: "Safe, Sealed Packing", text: "Moisture-proof bags with inner liners, clearly labelled with batch details." },
  { title: "On-Time Dispatch", text: "Ready stock and reliable logistics partners for quick, trackable delivery." },
  { title: "Fair, Transparent Pricing", text: "Clear quotes with no hidden charges — bulk and repeat-order rates available." },
];

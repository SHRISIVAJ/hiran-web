// ============================================================
//  PRODUCTS — add / edit products here.
//  Spec values below are TYPICAL industry values used as
//  placeholders. Replace with the client's actual TDS / COA.
//  `images` = product photo gallery (swipeable). `image` = the first one.
//  Photos live in /public/images/products/.
// ============================================================

export const products = [
  {
    slug: "soda-ash-light",
    name: "Soda Ash Light",
    grade: "99.2% Min",
    chemicalName: "Sodium Carbonate (Anhydrous)",
    formula: "Na₂CO₃",
    hsCode: "283620",
    casNo: "497-19-8",
    form: "White fine powder",
    visual: "powder",
    theme: "sky",
    image: "/images/products/soda-ash-light-1.webp",
    images: [
      { src: "/images/products/soda-ash-light-1.webp", alt: "Soda Ash Light — fine white powder" },
      { src: "/images/products/soda-ash-light-2.webp", alt: "Soda Ash Light sample in a lab glass dish" },
      { src: "/images/products/soda-ash-light-3.webp", alt: "Chemical warehouse with drums ready for dispatch" },
    ],
    short:
      "Fine, free-flowing white powder — the workhorse alkali for glass, detergent, textile and water treatment.",
    overview:
      "Soda Ash Light is a low-density, highly soluble grade of sodium carbonate. Its fine particle size makes it ideal for powder blending in detergents and for quick dissolution in textile and water-treatment processes.",
    specs: [
      ["Total Alkalinity (as Na₂CO₃)", "99.2% min"],
      ["Sodium Chloride (as NaCl)", "0.70% max"],
      ["Iron (as Fe)", "0.0035% max"],
      ["Sulphate (as SO₄)", "0.03% max"],
      ["Water Insoluble Matter", "0.04% max"],
      ["Bulk Density", "0.50 – 0.65 g/ml"],
      ["Appearance", "White powder"],
    ],
    applications: ["glass", "detergent", "textile", "water", "paper", "cleaning"],
    packaging: ["25 kg / 50 kg HDPE woven bags with inner liner", "1 MT jumbo bags on request"],
    storage: "Store in a cool, dry, covered area. Keep bags sealed — absorbs moisture from air.",
    safety: "Mild irritant to eyes and skin. Use gloves and goggles while handling.",
  },
  {
    slug: "caustic-soda-flakes",
    name: "Caustic Soda Flakes",
    grade: "99% Min",
    chemicalName: "Sodium Hydroxide",
    formula: "NaOH",
    hsCode: "281511",
    casNo: "1310-73-2",
    form: "White crystalline flakes",
    visual: "flakes",
    theme: "orange",
    image: "/images/products/caustic-soda-flakes-1.webp",
    images: [
      { src: "/images/products/caustic-soda-flakes-1.webp", alt: "Caustic Soda Flakes — white crystalline flakes" },
      { src: "/images/products/caustic-soda-flakes-2.webp", alt: "Caustic Soda Flakes in a lab beaker" },
      { src: "/images/products/caustic-soda-flakes-3.webp", alt: "Caustic Soda Flakes bags stacked on pallets in a warehouse" },
    ],
    short:
      "High-purity white flakes — a strong alkali for soap making, textile processing, paper and industrial cleaning.",
    overview:
      "Caustic Soda Flakes are solid sodium hydroxide in easy-to-handle flake form. A strong base used across soap and detergent manufacturing, textile mercerising, pulp and paper, alumina refining and heavy-duty cleaning.",
    specs: [
      ["Sodium Hydroxide (NaOH)", "99.0% min"],
      ["Sodium Carbonate (Na₂CO₃)", "0.50% max"],
      ["Sodium Chloride (NaCl)", "0.03% max"],
      ["Iron (as Fe₂O₃)", "0.005% max"],
      ["Appearance", "White flakes"],
    ],
    applications: ["detergent", "textile", "paper", "cleaning", "water"],
    packaging: ["25 kg multi-layer bags with heavy-duty PE liner", "Steel drums on request"],
    storage: "Strongly hygroscopic. Store sealed in a dry place, away from acids, aluminium and zinc.",
    safety:
      "CORROSIVE — causes severe skin burns and eye damage. Always use gloves, goggles and protective clothing. Add flakes to water slowly, never water to flakes.",
    hazard: true,
  },
  {
    slug: "citric-acid-monohydrate",
    name: "Citric Acid Monohydrate",
    grade: "Food Grade",
    chemicalName: "2-Hydroxypropane-1,2,3-tricarboxylic acid, monohydrate",
    formula: "C₆H₈O₇·H₂O",
    hsCode: "291814",
    casNo: "5949-29-1",
    form: "Colourless / white crystals",
    visual: "crystals",
    theme: "lime",
    image: "/images/products/citric-acid-monohydrate-1.webp",
    images: [
      { src: "/images/products/citric-acid-monohydrate-1.webp", alt: "Citric Acid Monohydrate — colourless crystals" },
      { src: "/images/products/citric-acid-monohydrate-2.webp", alt: "Citric Acid Monohydrate crystals in a lab glass dish" },
      { src: "/images/products/citric-acid-monohydrate-3.webp", alt: "Chemical processing plant" },
    ],
    short:
      "Food-grade crystalline acidulant (E330) for beverages, confectionery, pharma, cosmetics and eco cleaners.",
    overview:
      "Citric Acid Monohydrate is a natural-origin organic acid produced by fermentation. It provides clean sour taste, acts as a preservative and pH regulator, and is widely used in food, beverages, pharmaceuticals and personal-care products.",
    specs: [
      ["Assay", "99.5 – 100.5%"],
      ["Moisture", "7.5 – 9.0%"],
      ["Sulphated Ash", "0.05% max"],
      ["Sulphate", "150 ppm max"],
      ["Heavy Metals (as Pb)", "5 ppm max"],
      ["Mesh Size", "8 – 40 / 30 – 100 mesh"],
      ["Standard", "BP / USP / FCC"],
    ],
    applications: ["food", "pharma", "cleaning", "detergent"],
    packaging: ["25 kg kraft paper bags with food-grade PE liner"],
    storage: "Store in a cool, dry, hygienic area away from strong bases and oxidisers.",
    safety: "Eye irritant. Food-safe when used as directed.",
  },
];

export const themes = {
  sky: { accent: "#0284c7", soft: "#e0f2fe", deep: "#075985", label: "Industrial" },
  orange: { accent: "#ea580c", soft: "#ffedd5", deep: "#9a3412", label: "Industrial" },
  lime: { accent: "#16a34a", soft: "#dcfce7", deep: "#166534", label: "Food Grade" },
};

export const getProduct = (slug) => products.find((p) => p.slug === slug);

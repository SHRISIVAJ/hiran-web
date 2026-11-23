# Chemical Products Showcase Website

A static Next.js and Tailwind CSS site for a B2B chemical supplier. It has a Home page, a Products page, three product detail pages, an About page, and a Contact / Quote page.

## Run it

```bash
npm install
npm run dev      # starts a dev server at http://localhost:3000
npm run build    # builds the static site into /out
```

## Hosting

To deploy, upload the `out/` folder to any static host: Netlify (drag and drop), Vercel, Hostinger or cPanel.

## Where to edit

| What | File |
|---|---|
| Company name, phone, WhatsApp, email, address, GST, IEC | `data/site.js` |
| Products, specs, packaging, safety text | `data/products.js` |
| Home banner photo | Put the photo in `public/images/`, then set `heroImage` in `data/site.js` |
| Real product photos | Put the photos in `public/images/`, then set `image` on each product in `data/products.js` |
| Quote form emails | Get a free key from web3forms.com and set `web3formsKey` in `data/site.js` |

Without a Web3Forms key, the quote form opens WhatsApp with the enquiry already filled in.

## Before going live

- Replace every value marked PLACEHOLDER in `data/site.js`.
- Replace the typical spec values with the client's own TDS or COA.
- Set `site.url` to the real domain. The sitemap and SEO tags use it.
- Use only images you have rights to: your own photos, Pexels, Unsplash, or licensed Freepik images. Do not use photos taken from Alibaba or Made-in-China supplier listings.

## 3D visuals

- The Home banner is a live 3D scene built with three.js. Its code is in `lib/scene3d.js` and it loads after the page renders. Until it is ready, and on devices without WebGL, the page shows a still image, `public/images/hero-3d.webp`.
- The product images in `public/images/products/` are 3D renders. After you change a product's name, grade or color, re-render them with:

```bash
python tools/render-images.py           # all images
python tools/render-images.py hero      # only the hero still
```

This needs Google Chrome and Python.

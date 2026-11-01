# Next Solutions Website

The website for Next Solutions, Vapi: Tally sales, customisation and support, plus design, web and IT services. Built as a static Next.js site so it stays online without a server.

Status: slice 03 verified (performance budget still open). Stack: Next.js 16 static export, TypeScript, CSS Modules on a token layer, Motion and Embla for animation (ADR 0002). Started 2026-10-27.

## What is real

- Working: sixteen pages on Niket's own URLs (home, about, products and services, five product pages, digital marketing, contact, and five free GST and invoicing tools), with the circuit-network hero, product sliders, an interactive invoice demo, a customisation explorer, a Silver-or-Gold advisor, a scripted quick guide, and an enquiry form that opens WhatsApp with the visitor's message already written.
- Light and dark mode: follows the device setting, and the sun / moon switch in the header lets the visitor choose (remembered in their browser).
- Data: business details from his live site and public listings, prices with their source and date on the page. The invoice and report mock-ups use an invented company and are labelled as samples.
- To confirm with Niket before launch: see "Before going live" in `HANDOFF.md`.
- Not built: see the non-goals in `specs/000-product-brief.md`.

## Run it

Needs Node 20.9 or newer.

```bash
# setup
cd ui/frontend && npm install

# dev, with hot reload at http://localhost:3000
npm run dev

# all checks: typecheck, lint, unit tests, static build into ui/frontend/out
npm run check

# preview the production build at http://localhost:4173 (from the repo root)
python scripts/serve.py 4173 ui/frontend/out

# end-to-end journeys (from the repo root; needs: pip install playwright, and CHROME_PATH set to Chrome)
python scripts/smoke.py http://localhost:4173
```

Configuration: copy `.env.example` to `ui/frontend/.env.local` and set `NEXT_PUBLIC_SITE_URL` if the domain is not `https://nxtsolutions.in`.

## Deploy

`npm run build` writes plain HTML, CSS and JS to `ui/frontend/out/`. Any static host serves it.

- Vercel or Netlify: import the repo, set the root directory to `ui/frontend`, build command `npm run build`, output directory `out`.
- Cloudflare Pages: same settings; framework preset "Next.js (Static HTML Export)".
- Existing hosting (cPanel or similar): upload the contents of `out/` to the web root.

Then point nxtsolutions.in at the host and submit `https://nxtsolutions.in/sitemap.xml` in Google Search Console.

## Change the content

| To change | Edit |
| --- | --- |
| Phone, WhatsApp, email, address, hours, GSTIN, social links | `ui/frontend/src/content/business.ts` |
| Tally services, prices, customisations, FAQ | `ui/frontend/src/content/tally.ts` |
| Every product and service (pages, cards, sliders, mega-menu) | `ui/frontend/src/content/products.ts` |
| Free tools and their rates | `ui/frontend/src/content/tools.ts` |
| The four-step process | `ui/frontend/src/content/services.ts` |
| Clients, reviews and the client count | `ui/frontend/src/content/proof.ts` |
| Values and timeline | `ui/frontend/src/content/about.ts` |
| Logo | put the file in `images/`, run `node scripts/brand-assets.mjs`, check `ui/frontend/src/content/brand.ts` |
| Brand colors, light and dark | `ui/frontend/src/styles/theme.css` (both dark blocks must stay equal) |
| Founder photo | replace `ui/frontend/public/brand/niket-naik.webp` (square, 720 px) |

## Layout

| Path | Holds |
| --- | --- |
| `constitution.md` | governing rules, each with one proof line |
| `specs/` | product brief, slice spec, stack decision |
| `agents/` | instructions for coding agents, `AGENTS.md` is authoritative |
| `ui/frontend/src/app/` | pages, layout, metadata, sitemap, robots |
| `ui/frontend/src/components/` | layout shell, sections, UI primitives, brand |
| `ui/frontend/src/content/` | every fact, price and sample on the site |
| `ui/frontend/src/domain/` | rules, arithmetic and formatting, with tests |
| `ui/frontend/src/lib/` | config, SEO helpers, hooks |
| `ui/frontend/src/styles/` | `theme.css` tokens and base styles |
| `scripts/` | smoke test and screenshot tooling |
| `docs/` | architecture notes |

## Continuing this work

Read `HANDOFF.md` first. It states what is verified, what is not built, and the next acceptance criterion.

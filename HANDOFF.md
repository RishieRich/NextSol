# Handoff: Next Solutions Website

Last updated 2026-11-01.

## Delivered

Niket's own site, on his own URLs, in his logo and blue, built to plain static HTML:

- Sixteen pages: home, about, products and services, TallyPrime, Tally on Mobile, Tally on Cloud, Saral Billing, Saral Payroll, digital marketing and design, contact, and free tools (GST calculator, GST invoice generator, GSTIN checker, MSME delayed-payment interest, amount in words).
- Motion: a circuit-network hero grown from the logo, cascading reveals, ERP and cloud product sliders, counters and rings, a client marquee, a mega-menu, spotlight cards, and 3D emoji (Microsoft Fluent, MIT). Calm under reduced motion; fully readable without JavaScript.
- Tools that sell: an animated invoice (plain vs customised Tally), a customisation explorer, a Silver-or-Gold advisor, a quick guide that recommends software, and an enquiry form. All three hand off to WhatsApp with the visitor's need already written.
- A light / dark switch in the header (moon and sun). It follows the phone or computer setting until the visitor chooses, then remembers the choice.

## Verified

Run on 2026-11-01 against the static build, Chrome, 1440 px and 390 px.

| Check | Command | Result |
| --- | --- | --- |
| Typecheck, lint, unit tests, static build | `npm --prefix ui/frontend run check` | Pass; lint 0 problems; 97 tests |
| End-to-end journeys | `python scripts/smoke.py http://localhost:4173` | 14 of 14 pass |
| Contrast, light and dark | `node scripts/contrast.mjs` | 52 pairs pass |
| Lighthouse, mobile, live `/` | `npx lighthouse https://next-solutions-web.vercel.app/ --form-factor=mobile` | Perf 94, A11y 100, BP 100, SEO 100; LCP 1.4 s, CLS 0.004, TBT 270 ms |
| Lighthouse, mobile, live `/tally-prime/` | same | Perf 96, A11y 100, BP 96, SEO 100; LCP 1.3 s, CLS 0.015, TBT 212 ms |
| First Load JS per route | gzip of the scripts in each built page | 253 to 269 kB (budget 200) |
| Smoke against production | `python scripts/smoke.py https://next-solutions-web.vercel.app` | 14 of 14 pass |

Smoke journeys: 16 routes scrolled through with one h1 and no console errors; `/tally/` is 404; ERP slider by button and ArrowRight; mega-menu by keyboard and Escape; services filter; quick guide to TallyPrime Gold and WhatsApp; invoice toggle; customisation explorer by mouse and arrow keys; licence advisor paths; enquiry form errors then WhatsApp; mobile menu; light/dark switch (persists across pages, swaps logo and browser colour, phone starts dark from the system); reduced motion (no autoplay, all text visible); JavaScript off (all text visible).

Looked at by screenshot: every page at 1440 px and 390 px in light and dark.

Full results, Lighthouse detail and the fixes made during verification: `specs/003-slice-03-brand-motion.md`.

## Before going live

Confirm these with Niket. Each is one edit, listed with its file.

| Item | Current value | File |
| --- | --- | --- |
| Tally partner tier | "Tally Certified Solution Partner" (his Tally on Cloud page) | `src/content/tally.ts` (`partnerClaim`) |
| Client count | "1000+ clients" (his site) | `src/content/proof.ts` (`clientCountClaim`) |
| Permission to name clients, and client logos | Names shown, no logos | `src/content/proof.ts` |
| Biz Analyst prices | 7-day trial; ₹3,300 a year; ₹9,900 for 5 years, per device + GST | `src/content/products.ts` |
| Sales email | nextsolutions.service@gmail.com | `src/content/business.ts` |
| WhatsApp number | Same as phone, +91 97276 71017 | `src/content/business.ts` |
| Vyapar referral code shown | 77WDW1 | `src/content/products.ts` |
| High-resolution logo | 250 x 186 px source; ask for SVG or a 1000 px PNG, then rerun `scripts/brand-assets.mjs` | `images/`, `public/brand/` |
| Customisation starting price | From ₹5,500 (his IndiaMART listing) | `src/content/tally.ts` |
| Tally list prices | Silver ₹22,500, Gold ₹67,500, per Tally Solutions, July 2026 | `src/content/tally.ts` |
| Testimonials | Two anonymous Google review excerpts | `src/content/proof.ts` |
| Founder photo | The portrait Rishi shared | `public/brand/niket-naik.webp` |

## Not built

| Excluded | Why |
| --- | --- |
| Backend, database, stored enquiries | Static site by design; enquiries go to WhatsApp |
| AI chat assistant | Needs a server for the model key; the quick guide is scripted and says so |
| Gujarati and Hindi pages | English first |
| Analytics and cookie banner | No tracking, so no consent banner |
| Blog, case studies | No real material yet; `content/portfolio.ts` is empty on purpose |

## Known limits

- Two budgets are still over: TBT is 270 ms on `/` and 212 ms on `/tally-prime/` (budget 200), and First Load JS is 253 to 269 kB (budget 200). Performance scores themselves pass on Vercel (94 and 96). Plan in `specs/003-slice-03-brand-motion.md`.
- Pushing to `main` does not deploy: the Vercel project is not connected to GitHub. Deploy with `vercel deploy --prod` from `ui/frontend`, or run `vercel git connect` once.
- The invoice and report mock-ups use an invented company and are labelled as samples.
- Prices change; check the `asOf` dates in `content/tally.ts`, `content/products.ts` and `content/tools.ts` every few months.
- `NEXT_PUBLIC_SITE_URL` is baked in at build time.

## Operational notes

- Live: https://next-solutions-web.vercel.app (production, deployed 2026-11-01 from commit `2d6758d`).
- Deploy: Vercel project `next-solutions-web`, linked in `ui/frontend` (build `npm run build`, output `out`); `vercel deploy --prod` from there. Other static hosts: README.
- Local preview: `python scripts/serve.py 4173 ui/frontend/out`.
- Smoke and screenshots need `pip install playwright` and `CHROME_PATH` pointing at Chrome. In Git Bash, prefix route arguments with `MSYS_NO_PATHCONV=1`.

## Next

Next acceptance criterion: the site live on nxtsolutions.in with every "Before going live" item confirmed, and the sitemap read in Google Search Console with 16 pages discovered.
Then: TBT at most 200 ms and First Load JS at most 200 kB per route.

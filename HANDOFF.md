# Handoff: Next Solutions Website

Last updated 2026-10-27.

## Delivered

A five-page static website for Next Solutions, Vapi, in Niket's blue: Tally licences, customisation and support up front, with an animated invoice that switches between plain and customised Tally, a customisation explorer, a Silver-or-Gold advisor, and an enquiry form that opens WhatsApp with the visitor's need already written. It builds to plain HTML, so it can run on any static host instead of a laptop.

## Verified

| Check | Command | Result |
| --- | --- | --- |
| Typecheck (strict) | `npm --prefix ui/frontend run typecheck` | Pass |
| Lint (Next core web vitals + TypeScript) | `npm --prefix ui/frontend run lint` | Pass, 0 problems |
| Unit tests: licence rule, enquiry validation and message, WhatsApp URL, money formatting, invoice and report arithmetic | `npm --prefix ui/frontend run test` | 32 passed |
| Static build | `npm --prefix ui/frontend run build` | 5 pages + 404, sitemap.xml, robots.txt, icon |
| End-to-end journeys against the build | `python scripts/smoke.py http://localhost:4173` | 6 of 6 pass |
| ARQ gate | `python <arq-zero-to-one>/scripts/verify.py .` | See note below |

Journeys exercised in a real browser (Chrome, Playwright): all pages load with one h1 and no console errors; invoice toggle; five explorer tabs by mouse and arrow keys; advisor Silver, Gold and consult paths; enquiry form errors, first-field focus, then WhatsApp opened with need, name, business and mobile in the message; mobile menu open and Escape.

Looked at by screenshot: every page at 1440 px and 390 px in light mode, home in dark mode, every explorer preview, the standard invoice state, and the mobile menu.

ARQ gate note: it passes structure, constitution (8 rules, all proven), token layer, focus, reduced motion, dark tokens, alt text and secrets. It reports "no tests" because it only looks in `ui/backend/tests/`; this site has no backend (ADR 0001) and its 32 tests live in `ui/frontend/src/domain/`. Run the gate on a clean tree (no `ui/frontend/out/`), or it also counts compiled CSS as colors outside the token layer.

## Before going live

Confirm these with Niket. Each is one edit, listed with its file.

| Item | Current value | File |
| --- | --- | --- |
| Shop address (three versions exist online) | 106, Bass Complex, GIDC Char Rasta, Vapi 396191 | `src/content/business.ts` |
| WhatsApp number | Same as phone, +91 97276 71017 | `src/content/business.ts` |
| Email | None shown | `src/content/business.ts` |
| Real logo | Built-in N-and-chevron mark | `public/brand/` + `src/content/brand.ts` |
| Exact brand blue | #1b5bd0 | `src/styles/theme.css` |
| Tally partner tier | Not claimed anywhere | add to Hero and About once confirmed |
| Customisation starting price | From ₹5,500 (his IndiaMART listing) | `src/content/tally.ts` |
| Tally list prices | Silver ₹22,500, Gold ₹67,500, per Tally Solutions, July 2026 | `src/content/tally.ts` |
| Permission to name the 7 clients | Shown | `src/content/proof.ts` |
| Testimonials | Two anonymous Google review excerpts | `src/content/proof.ts` |
| Services list | Insurance dropped; 3D visuals kept | `src/content/services.ts` |
| Founder photo | The portrait Rishi shared | `public/brand/niket-naik.webp` |

## Not built

| Excluded | Why |
| --- | --- |
| Backend, database, stored enquiries | Static site by design; enquiries go to WhatsApp, where Niket already works |
| AI chat assistant | Next slice, once the site is live and getting traffic; needs a server for the model key |
| Gujarati and Hindi pages | English first; i18n is a later slice |
| Analytics and cookie banner | No tracking in v1, so no consent banner needed |
| Theme switch button | Tokens already honour `data-theme`; only the button is missing |
| Blog or case studies | No case-study material yet |

## Known limits

- The invoice and report mock-ups use an invented company and are labelled as samples.
- Prices change; `asOf` dates in `content/tally.ts` need a check every few months.
- The Google Maps link opens a search for the address; it is not a pinned place until Niket's Google Business Profile address is fixed.
- `NEXT_PUBLIC_SITE_URL` is baked in at build time.

## Operational notes

- Deploy: `npm run build` in `ui/frontend`, then serve `out/`. Vercel, Netlify and Cloudflare Pages settings are in `README.md`.
- After launch: point nxtsolutions.in at the host, retire the laptop server, submit the sitemap in Google Search Console, and update the address on IndiaMART, LinkedIn and Google so all three match `business.ts`.
- The smoke test needs `pip install playwright` and a Chrome binary (`CHROME_PATH`).

## Next

Next acceptance criterion: the site is live on nxtsolutions.in from a static host, with every "Before going live" item confirmed, and Google Search Console shows the sitemap read with 5 pages discovered.
Spec: `specs/000-product-brief.md` (acceptance criteria 1 to 8 hold in production).

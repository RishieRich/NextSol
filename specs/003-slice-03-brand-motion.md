# Slice 03: brand, motion, product pages, free tools and theme switch

Part of: `specs/000-product-brief.md`. Prompt: `specs/003-brand-and-motion-upgrade.md`. Status: verified, except the performance budgets (see "Not met").

## Outcome

A visitor sees Niket's own logo and blue, the page structure of his current site, and a site that moves: the circuit-network hero, cascading reveals, product sliders, counters, a logo marquee and a mega-menu. Every product he sells has a page or a card. Five free GST and invoicing tools run in the browser. A scripted quick guide recommends software and opens WhatsApp. A header switch picks light or dark mode. Without JavaScript, or with reduced motion, every word is still there.

## In scope

- Brand: real logo (header, on-dark footer variant, favicons from the "N"), palette from his site (#086AD8, ink #001D23), `// label //` and blue full stop devices.
- Routes on his live URLs: `/`, `/about/`, `/services/`, `/tally-prime/`, `/tally-on-mobile/`, `/tally-on-cloud/`, `/saral-billing/`, `/saral-payroll-software/`, `/portfolio/`, `/contact/`; `/tally/` removed.
- Free tools: `/tools/` and five tools (GST calculator, GST invoice generator, GSTIN checker, MSME delayed-payment interest, amount in words), every rate sourced and dated.
- Home in his order: hero network, statement, ERP and cloud sliders, insights bento, licence advisor, marketing grid, why us, process, clients marquee, about teaser, free tools strip, contact.
- Product page template fed by `content/products.ts`; services index with animated filters.
- 3D emoji (Microsoft Fluent Emoji, MIT) through `content/emoji.ts` and `<Emoji>`.
- Motion system (ADR 0002) and light/dark switch (ADR 0003).
- Quick guide: `domain/guide.ts` decision tree, chat-style panel, WhatsApp hand-off. Not presented as AI.

## Out of scope

- Server, storage, analytics, AI model calls, i18n, blog.

## Contracts

```text
content/products.ts   products[]: slug, name, emoji, category, oneLiner, features, prices?{items, source}, related[], page?
content/emoji.ts      emoji map: key -> { file, name }
content/tools.ts      tools[], gstRates{presets, source}, rate sources with asOf
content/about.ts      values[], timeline[]
content/portfolio.ts  work[] (empty until real work is supplied)

domain/guide.ts       guide tree: every path ends in a product slug from products.ts
domain/gst.ts, gstin.ts, msme.ts, words.ts, calendarDate.ts   tool arithmetic and checks
lib/motion.ts         motionTokens and shared variants (fadeUp, cascade, scaleIn, drawPath, wordReveal)
lib/theme.ts          THEME_SCRIPT, readTheme, setTheme, subscribeTheme, syncThemeColor
```

## Acceptance criteria and results

Verified 2026-11-01 against the static build served by `scripts/serve.py`, Chrome 1440 px and 390 px.

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Every route builds as static HTML with one h1, no console errors, in `sitemap.xml`; `/tally/` gone | Pass: 16 routes, scrolled through, one h1 each, no console errors; sitemap lists all 16; `/tally/` returns 404 and nothing links to it |
| 2 | Real logo in header, on-dark variant in footer, favicons from the "N" | Pass (screenshots, both themes) |
| 3 | His blue and ink; every text pair passes AA in light and dark | Pass: `scripts/contrast.mjs` 52 pairs; Lighthouse accessibility 100 on `/` and `/tally-prime/` |
| 4 | No content from the old site's theme junk | Pass: no match for the section 2.3 strings in `src/` or `out/` |
| 5 | Hero, sliders, cascades, counters, marquee, mega-menu, cards and guide work by mouse, touch and keyboard, and degrade under reduced motion and without JavaScript | Pass: `scripts/smoke.py`, 14 of 14 |
| 6 | Lighthouse budgets on `/` and `/tally-prime/` | Not met: see below |
| 7 | `npm run check` and `scripts/smoke.py` pass, including earlier journeys | Pass: typecheck, lint (0 problems), 97 unit tests, build; smoke 14 of 14 |
| 8 | Light/dark switch works, persists, swaps the logo, no flash | Pass: smoke "theme switch" journey |

### Lighthouse (mobile, local Python server without compression)

| Page | Performance | Accessibility | Best practices | SEO | LCP (simulated / observed) | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 52 | 100 | 100 | 100 | 3.5 s / 1.5 s | 0.007 | 2.8 s |
| `/tally-prime/` | 43 | 100 | 96 | 100 | 8.8 s / 1.6 s | 0 | 1.4 s |

TBT varied between runs on this laptop (home 0.26 s to 2.8 s; `/tally-prime/` 4.1 s to 1.4 s), so the numbers carry noise. A run against a Vercel preview, with compression and a CDN, is the honest measure.

### First Load JS (gzip, from the built HTML)

| Route | kB |
| --- | --- |
| `/`, `/tally-prime/` | 269 |
| product pages | 262 |
| `/tools/gst-invoice-generator/` | 263 |
| `/services/` | 256 |
| `/about/`, `/portfolio/`, `/contact/`, `/tools/` | 253 to 254 |

Budget: 200 kB. Framework (React DOM, Next router and client) is about 154 kB of that; the Motion runtime about 44 kB; site code about 70 kB.

## Not met, and the plan

- Performance 90 and First Load JS 200 kB are not met. Next steps, in order: measure on a Vercel preview; move the header scroll progress and shrink (`useScroll`, `useSpring`) and the guide panel off Motion to CSS and a lazy import so Motion loads only where a section needs it; profile the `/tally-prime/` style-and-layout cost (5.7 s main-thread style and layout in the first run).
- Best practices on `/tally-prime/` is 96 because the hero shows the 160 px emoji larger than its natural size on high-density screens.

## Fixed during verification

- Sliders whose slides all fit (related products on four product pages at desktop width) threw on every view: Embla's autoplay skips its setup when there is nothing to scroll. Autoplay and controls now apply only when the slider can scroll.
- The first page of a visit faded in from opacity 0, holding back the largest paint; the fade now runs on navigations only.
- Statement words started at 25% opacity (1.7:1); the floor is now 70%, which keeps AA in both themes.
- CTA band text at 85% opacity (4.18:1) is now full strength.
- Slider slides were `li` elements with `role="group"`, which broke list semantics; they are now plain groups.
- The tool pages' "How this is calculated" block sat at the left edge of wide screens; it now aligns with the content.
- The smoke test now scrolls through every route, so errors that start on scroll fail it.

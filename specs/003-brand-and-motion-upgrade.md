# Slice 03 prompt: brand and motion upgrade

Hand this whole file to Claude Code, from the repository root:

> Read `specs/003-brand-and-motion-upgrade.md` and carry it out phase by phase. Follow `agents/AGENTS.md` and `constitution.md` except where this file explicitly changes them.

---

## 0. Ground rules

- Read `agents/AGENTS.md`, `constitution.md`, `HANDOFF.md`, `specs/000-product-brief.md` and `specs/decisions/ADR-0001-stack.md` before changing anything. Reuse existing patterns: content in `src/content/`, rules in `src/domain/`, presentation in `src/components/`, every colour and duration in `src/styles/theme.css`.
- The site stays a static export (`output: "export"`). Nothing in this slice needs a server.
- Work in the phases in section 13. After each phase, run `npm --prefix ui/frontend run check`, serve `ui/frontend/out` on port 4173, run `python scripts/smoke.py http://localhost:4173`, and fix everything before starting the next phase. If the repository is a git repository, commit after each phase.
- Never invent facts, prices, client names, testimonials, URLs or partner tiers. Everything factual in this file was read from Niket's live site, nxtsolutions.in, on 31 October 2026. Items marked CONFIRM go into the HANDOFF "Before going live" table.

## 1. Goal

Niket wants his site to look like a premium, modern technology company: his own logo and brand, the page structure he already knows, and rich motion. That means 3D emoji instead of flat icons, cascading reveals, sliders, an animated hero that feels "AI", and polished micro-interactions. Compared with his current WordPress site it should feel like a 100x upgrade, while staying fast on a mid-range Android phone on 4G and fully accessible.

## 2. Research: what his live site has today

### 2.1 His page pattern (keep this structure, upgrade the execution)

1. Thin top bar: email, phone, address, social icons.
2. Header: logo on the left; nav with Home, About, Products & Services (dropdown), Digital Marketing, Contact; a search icon; "Have any questions? +91 97276 71017"; a solid blue "Get A Quote +" button.
3. Hero: headline "Innovative IT Solutions." with a blue full stop, "Get In Touch" button, a small rotating ticker ("*** Tally Customization"), a stock photo of a man holding a phone, and two stat cards with circular progress rings.
4. A centred `// services //` label above a large blue sentence: "NEXT Solutions is your one-stop shop for Tally PRIME Implementations, Tally Customization, E-Commerce Development, Mobile App Development, Payroll Solutions, Saral ERP Software, Barcode Solutions, Computer Sales & Service."
5. Two cards: Social Media Marketing (strategy, management, advertising) and Designing (logo, packaging, brochure, visiting card).
6. `// billing software //` "ERP SOFTWARE": a carousel of product posters with prev and next arrows.
7. `// cloud services //` "CLOUD SOFTWARE": a second carousel.
8. "GET POWERFUL BUSINESS INSIGHTS": three cards (Barcode Scanning, Track GST, Tally Integration).
9. About: "We've Been Thriving In 10 Years."
10. Blog ("News Feeds"), client logo strip, footer with a link list, and a dark base bar.

His signature visual devices are the `// label //` above section titles, the blue full stop at the end of headings, centred section titles, product carousels with round arrow buttons, and circular stat rings. Keep these devices, executed well.

### 2.2 Real facts to use

| Fact | Value | Where it lives after this slice |
| --- | --- | --- |
| Email | info@nxtsolutions.in | `content/business.ts` (`email`) |
| Sales email | nextsolutions.service@gmail.com (CONFIRM it is still used) | `content/business.ts` (`salesEmail`) |
| Phone and WhatsApp | +91 97276 71017 | already in `business.ts` |
| Address | Shop No. 16, Bass Complex, GIDC, Vapi, Gujarat 396191 (matches his site and Google listing) | `business.ts`; replaces "106, Bass Complex" everywhere |
| Facebook | https://www.facebook.com/NextSolutions7 | `business.links.facebook` |
| Founder LinkedIn | https://www.linkedin.com/in/niketnaik-founder/ | `business.links.founderLinkedin` |
| Experience claim | "10+ years" (founded 2015, so derive it with `yearsSince`) | `business.ts` |
| Clients claim | "1000+ clients" (CONFIRM) | `content/proof.ts` (`clientCountClaim`) |
| Partner claim | "We are Tally Certified Solution Partner" (his Tally on Cloud page; CONFIRM the tier) | `content/tally.ts` (`partnerClaim`) |
| Values | Respect and faith toward customers; growth through creativity and innovation; honesty and ethics in every dealing | `content/about.ts` |
| Vyapar | He is a Vyapar referral partner, code 77WDW1 | `content/products.ts` |

Products and their real content from his pages (clean up the wording, keep the substance):

| Product | Real content on his site |
| --- | --- |
| TallyPrime | Accounting, inventory, banking, cash and credit management; invoices with your logo and layout, GST invoices, e-invoice, e-way bill, MSME Udyam number on invoices; payment QR codes and links; Bill of Materials; multiple addresses; order-based or direct purchase and sales. Prices: use the sourced values already in `content/tally.ts` (Silver ₹22,500, Gold ₹67,500, rental from ₹750 a month, all + GST). His page says "What's new in TallyPrime 6.0", but Tally's current release is 7.1, so do not mention a version number. |
| Tally on Mobile (Biz Analyst) | Work from anywhere; built on official TallyPrime and Tally ERP 9 integration; outstanding reminders; sales analysis; data entry from the app (8+ entry types); top customers report, expense analysis, daybook, sales and purchase order analysis, ledger report, multiple companies; automated sharing of invoices; follow-up reminders. Prices (his page, CONFIRM): 7-day free trial; ₹3,300 a year per device + GST; ₹9,900 for 5 years per device + GST. |
| Tally on Cloud | Access from office, branch and home; lightweight, low bandwidth; TDL customisation support; browser access through a client portal; automated backup to Google Drive, OneDrive, Dropbox or Amazon S3 on a schedule; works on Windows, Mac, Linux and iOS. No real prices: say "Ask for today's price". |
| Tally Autobackup | Scheduled data backup. |
| Saral Billing / Saral Accounts (by Relyon) | GST-ready accounting for Indian businesses; GSTR-1, GSTR-2B, GSTR-3B; data sync and migration; inventory by serial number, batch and expiry; service invoicing; e-way bill and e-invoice through API; AMC and warranty tracking. |
| Saral PayPack (payroll) | Salary management, payslips, TDS management, shift-based working. |
| Busy | For retail shops and FMCG. |
| Vyapar | Billing software; referral code 77WDW1. |
| Real Estate CRM | CRM application for real estate. |
| Bulk WhatsApp | WhatsApp marketing software. |
| Services | Tally implementation and customisation, e-commerce development, mobile apps, barcode solutions, computer sales and service, CCTV (in his page title), social media marketing (strategy, management, advertising), design (logo, packaging, brochure, visiting card). |

### 2.3 Junk on his site: never carry any of it over

Lorem ipsum; the team members "Rosalina D. William", "Miranda H. Halim" and "Alim D. Dhario" (theme demo people); the $29, $59 and $99 "Basic, Pro, Ultra" plans; skill bars (Interior Design 72% and similar); "Mitech Management Systems" and the other "Why choose us" filler; "Level is high" and "Don't worry about it"; the three fake blog posts (NodeJS error handling, SEO guide, design teams); the theme pages Team, Team 2, Team 3, Price 1, Price 2, Why Chose and FAQ; `/wp/bngtech/` links; `#` placeholder links; the stock photo of a man; vendor marketing posters (Tally, Vyapar, Biz Analyst artwork belongs to those vendors, so use product names in text and our own visuals instead).

## 3. Brand

### 3.1 Logo

- The user has placed Niket's logo in an `images` folder in the repository. Find it with `find . -path ./ui/frontend/node_modules -prune -o -ipath "*images*" -type f -print`. If none is found, stop and ask.
- Next.js only serves files under `ui/frontend/public/`, so copy it to `ui/frontend/public/brand/` and leave the original in place.
- Add `sharp` (^0.35.5) as a devDependency and write `scripts/brand-assets.mjs` that:
  1. writes `logo.webp` from the original;
  2. writes `logo-on-dark.webp`, with the white background made transparent (near-white pixels to alpha, keeping anti-aliased edges soft) and the black "SOLUTIONS" text recoloured to white, so the logo works on the dark footer;
  3. samples the logo's navy (the "N") and sky blue (the "EXT") and prints both hex values;
  4. writes favicons from a square crop around the "N" with its circuit tree: `src/app/icon.png` (512) and `src/app/apple-icon.png` (180). Delete the current `src/app/icon.svg`.
- Screenshot both logo variants on light and dark backgrounds and look at them before moving on.
- Fill `content/brand.ts` with the files and dimensions; `Logo.tsx` already switches to the real logo when `brandLogo` is set. Add an on-dark variant field and use it in the footer.
- The source is roughly 250 x 186 px. Never display it above its native size: about 56 px tall in the header and 48 px when the header shrinks. Add "ask Niket for an SVG or a 1000 px PNG of the logo" to HANDOFF.

### 3.2 Palette (update `theme.css`; keep the token names where they exist)

| Role | Value | Note |
| --- | --- | --- |
| Primary blue (`--ns-blue`) | #086AD8 | His button blue. 5.17:1 on white, AA. |
| Ink (`--ns-text`, dark bands, footer base) | #001D23 | His heading and footer colour. Replaces the current navy for dark sections. |
| Secondary text (`--ns-text-2`) | #5E6778 | His grey #737C8C fails AA (4.21:1); this darker version passes (5.70:1). |
| Blue on dark surfaces | #4D9BF0 | #086AD8 on #001D23 is only 3.39:1, so never use it for text on dark. |
| Logo navy and logo sky (`--ns-logo-navy`, `--ns-logo-sky`) | sampled by the script | Accent for circuit traces, light pulses and highlights. Retire the amber accent except where a warm highlight is truly needed. |

- Recheck every pair you use with a contrast script; text must reach 4.5:1 and large text 3:1. Update the dark-mode values to match the new palette.
- His hero has a faint paper grain. Add a 3% opacity SVG noise texture to hero backgrounds only, as a token-driven CSS background.

### 3.3 Type and devices

- Keep Schibsted Grotesk (self-hosted, already installed).
- Keep his `// label //` device above section titles: small, sentence case, brand blue, rendered as decorative text with the real heading in the `h2`.
- Keep his blue full stop at the end of the main headings. Render it as a styled `span` inside the heading text, not as an image.

## 4. Routes: keep his live URLs

His current URLs are what Google has indexed, so keep them as routes:

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about/` | About |
| `/services/` | Products and services index (was our services page; now covers everything) |
| `/tally-prime/` | TallyPrime. Move everything from our current `/tally/` page here, then delete `/tally/` (it was never live). |
| `/tally-on-mobile/` | Biz Analyst |
| `/tally-on-cloud/` | Tally on Cloud |
| `/saral-billing/` | Saral Billing / Accounts |
| `/saral-payroll-software/` | Saral PayPack |
| `/portfolio/` | Digital marketing and design (title it that way; keep the URL) |
| `/contact/` | Contact |

Busy, Vyapar, Real Estate CRM, Tally Autobackup and Bulk WhatsApp get cards on `/services/` and in the sliders, not their own pages yet. Update `primaryNav`, the footer, the sitemap and every internal link. Theme demo URLs (`/team/`, `/price-1/` and the rest) are allowed to 404.

## 5. Page specifications

### 5.1 Global

- **Top bar** (desktop only): email, phone, address, Facebook and LinkedIn. It slides away when the page scrolls past 40 px.
- **Header**: real logo; nav with a Products & Services mega-menu (two columns, each item with its 3D emoji and a one-line summary, items cascading in when it opens; keyboard and touch accessible; closes on Escape and outside click); "Have any questions?" plus the phone number; "Get a quote" button that opens the enquiry on `/contact/`. The header shrinks and gains a glass background on scroll. Add a 2 px scroll-progress bar in brand blue under it.
- **Footer**: his pattern. An about blurb, quick links (Home, TallyPrime, Tally on Cloud, Tally on Mobile, Saral Billing, Saral Payroll, Digital marketing, Contact), contact details, social links, the on-dark logo, and a #001D23 base bar with copyright, GSTIN, the Tally trademark note and the emoji credit.
- **Mobile**: keep the Call and WhatsApp bar. The mega-menu becomes an accordion inside the mobile sheet.
- **Back to top** button appears after two screens of scrolling.

### 5.2 Home, in his order

1. **Hero (the signature moment).** Left: headline built from his "Innovative IT Solutions." idea but specific, for example "Innovative IT solutions for Vapi's businesses." with the blue full stop; a one-line lede; a rotating ticker replacing his "*** Tally Customization" line, cycling through Tally customisation, GST billing, Tally on Cloud, Payroll, Websites and apps, and CCTV and computers with a vertical slot-machine roll; "Get a quote" and "Chat on WhatsApp" buttons; and his stat cards rebuilt honestly: 10+ years, 1000+ clients (CONFIRM) and "Tally Certified Solution Partner" (CONFIRM), each with a ring that draws in and a number that counts up. Right: a **circuit network inspired by his logo**. A central chip carrying the logo's "N" grows circuit traces like the tree on top of his logo, out to six floating 3D-emoji chips (TallyPrime, Cloud, Mobile, GST billing, Payroll, WhatsApp marketing). On load the traces draw in as a cascade (about 1.2 s total) and the chips pop in. Afterwards, light pulses in logo sky-blue travel along the traces every 3 to 5 s. Chips float gently. On desktop the network shifts slightly with the pointer (12 px maximum), and hovering a chip lifts it, lights its trace and shows its name. Clicking a chip goes to that product. Build it as inline SVG plus the emoji images, no canvas or WebGL. Animation pauses when the hero is off-screen or the tab is hidden.
2. **One-stop-shop statement.** His `// services //` label and his blue sentence, now as a scroll-linked reveal: each service name is a pill with its emoji, and words brighten from 25% to 100% opacity as the visitor scrolls through the section.
3. **ERP and billing software slider** (`// billing software //`). Cards for TallyPrime, Saral Billing, Busy, Vyapar (with the referral code and a copy button), Saral PayPack and Real Estate CRM. Each card has a large 3D emoji, name, one-liner, three bullet points, and a "View details" link (product page) or "Ask on WhatsApp" (prefilled). Use glass cards with the hover spotlight and sheen from section 7.
4. **Cloud software slider** (`// cloud services //`). Tally on Cloud, Tally on Mobile (Biz Analyst), Tally Autobackup and Bulk WhatsApp, same card system.
5. **Get powerful business insights.** A bento grid of his three ideas, each with a small live mini-demo built from existing pieces: Barcode scanning (the laser scan from `CustomisationPreviews`), Track GST (an animated CGST/SGST split bar), Tally integration (two app tiles with sync arrows pulsing between them). Add a link to the customisation explorer on `/tally-prime/`.
6. **Licence advisor.** The existing `LicenceAdvisor`, restyled to the new palette.
7. **Marketing and design.** His two cards (Social media marketing, Designing) plus Web and apps, Barcode solutions, and Computers and CCTV, as a grid that cascades in on scroll.
8. **Why Next Solutions.** A number band with counters (years, clients) and three reasons drawn from real material: a local shop at GIDC Vapi, after-sales support (quote the real Google review), and Tally certified support (CONFIRM).
9. **Process.** The existing four steps, with the connecting line drawing on scroll.
10. **Clients.** An infinite logo marquee (his client logos, CONFIRM permission) above the named clients and the two real Google reviews. If no logo files are supplied, show names only.
11. **About teaser.** Niket's photo (`/brand/niket-naik.webp`), "Thriving for 10+ years." (his heading, cleaned up), two lines of story, and a link to About.
12. **Contact.** The existing `ContactBlock`.

There is no blog. Remove it until real posts exist.

### 5.3 Product page template (`src/components/product/`)

One layout component fed by `content/products.ts` with:

- a hero holding a big 3D emoji with its floor shadow, the product name with blue full stop, a one-liner, the primary call to action, and three key-benefit chips;
- a features grid built from his real feature text, cascading in on scroll;
- pricing only where real: TallyPrime reuses `EditionsTable` and `LicenceAdvisor`; Biz Analyst shows the trial, 1-year and 5-year cards with their source; everything else shows "Ask for today's price" with a WhatsApp button (no invented plans);
- an FAQ section where content exists (TallyPrime reuses `TallyFaq`);
- a related-products slider and the `CtaBand`.

`/tally-prime/` also keeps `TallySuite` (detailed), `CustomisationExplorer` and the `InvoiceDemo`.

### 5.4 Other pages

- **`/services/`**: every product and service as cards with filter chips (All, Accounting and GST, Cloud and mobile, Billing and payroll, Marketing and design, IT and hardware). Filtering animates with Motion layout transitions so cards slide into their new positions.
- **`/portfolio/`**: digital marketing and design services (the real ones above), plus a work grid that renders only from `content/portfolio.ts` entries. The list is empty by default; never add fake case studies.
- **`/about/`**: existing `AboutStory`; a timeline from 2015 to today (milestones only from real facts: founded 2015, the product lines he carries); his three values as cards with emoji; `Proof`.
- **`/contact/`**: existing page plus the sales email (CONFIRM) and a Directions button using `mapsUrl()`.

## 6. 3D emoji system

- Use **Microsoft Fluent Emoji, 3D style** (MIT licence, github.com/microsoft/fluentui-emoji). Native emoji look different on Windows, Android and iPhone and read as cheap on Windows; these 3D images look identical everywhere and give the glossy look Niket wants.
- Do not add the 17.7 MB npm package as a dependency. Write `scripts/fetch-emoji.mjs` that downloads only the emoji listed in `content/emoji.ts` from the official repository (look up the real asset paths in the repo; do not guess them), converts each to a 160 px WebP with sharp, and writes them to `ui/frontend/public/emoji/`. Commit the outputs. The script is idempotent.
- Add `public/emoji/LICENSE.txt` with Microsoft's MIT notice, and a footer credit: "3D emoji: Microsoft Fluent Emoji (MIT)".
- `content/emoji.ts` is a typed map from key to file and name. Start with: tally 📒, customisation 🛠️, cloud ☁️, mobile 📱, backup 🛡️, gst 🧾, ewaybill 🚚, saral 🗂️, payroll 💰, busy 🏪, vyapar 📈, crm 🏢, whatsapp 💬, barcode 🏷️, web 🌐, apps 📲, marketing 📣, design 🎨, computers 💻, cctv 📹, support 🤝, years 🏆, clients 🙌, location 📍, sparkles ✨, rocket 🚀, chart 📊, lock 🔒, idea 💡. Add more only through this map.
- `<Emoji name="cloud" size={56} />` renders an `img` with `alt=""` and `aria-hidden="true"`, explicit width and height (no layout shift), `loading="lazy"` below the fold and `decoding="async"`. The text next to it always carries the meaning.
- The "reflective" treatment:
  - a soft blurred ellipse shadow under the emoji;
  - a gentle float (6 px, 4 to 6 s, each emoji at a different phase);
  - on card hover, a diagonal light sheen sweeps across the card and the emoji tilts toward the pointer (8 degrees maximum, devices with hover only).
  - Under reduced motion: static, shadow only.

## 7. Motion system

### 7.1 Libraries (record them in a new `specs/decisions/ADR-0002-motion.md`)

- `motion` ^14.9.0 (Motion for React, MIT), imported from `motion/react`. Use `LazyMotion` with `domAnimation` and `m.*` components to keep the bundle small.
- `embla-carousel-react` ^8.6.0 and `embla-carousel-autoplay` ^8.6.0 (MIT) for every slider.
- Nothing else: no GSAP, no Lenis or smooth-scroll hijacking, no Three.js, no Lottie, no particles library. One library per job.
- Update the Motion paragraph in `agents/AGENTS.md`: the old "one load sequence only" rule is replaced by this section.

### 7.2 Foundations

- Add motion tokens to `theme.css` (durations, easings, cascade stagger of 60 to 90 ms, reveal distance of 16 to 24 px) and `src/lib/motion.ts` with shared variants: `fadeUp`, `cascade` (container plus item), `scaleIn`, `drawPath`, `wordReveal`. Components use these variants, never ad-hoc numbers.
- **No content may depend on JavaScript to become visible.** Hidden starting states apply only after a tiny inline script in `layout.tsx` adds `motion-ready` to `<html>`. Without JavaScript, and for crawlers, the page renders fully in its final state.
- **Reduced motion** (`useReducedMotion` plus the existing CSS rule): no autoplay, no parallax, no float, no pulses, no tilt; reveals become instant. Also honour `navigator.connection.saveData` by turning off decorative loops.
- Animate only `transform`, `opacity`, `filter` (small blur), `clip-path` and `stroke-dashoffset`/`pathLength`. Never animate width, height, top or left.
- At most one decorative loop is visible per viewport besides the logo marquee. Loops pause off-screen.

### 7.3 Effects to build

- **Cascading reveals**: section headers reveal word by word (40 ms stagger). The real heading text stays in the DOM for screen readers and search; split words are `aria-hidden` visual copies. Grids and lists reveal their children with the cascade variant, once, on first view.
- **Scroll-linked**: the one-stop-shop statement (section 5.2, item 2), the process line, and a gentle parallax on the about photo (desktop only).
- **Counters and rings**: count up over 1.2 s when in view, using the `tabular` class only on the number.
- **Sliders (Embla)**: loop, drag and swipe, autoplay every 4.5 s that stops on interaction and pauses on hover, focus and off-screen; prev and next buttons styled like his round arrows with `aria-label`s; dot buttons with `aria-current`; a thin progress bar. Slides are list items in a `region` with `aria-roledescription="carousel"` and an accessible name. Arrow keys work when the slider has focus. Under reduced motion, autoplay is off.
- **Logo marquee**: CSS-only infinite scroll with the duplicate set `aria-hidden`; pauses on hover and focus; becomes a static wrapped grid under reduced motion.
- **Micro-interactions**:
  - primary buttons get a light shine sweep on hover and a subtle magnetic pull (desktop only, 6 px maximum);
  - cards get a pointer-following spotlight (radial gradient driven by CSS variables);
  - featured cards get an animated conic gradient border (6 s loop, paused off-screen);
  - nav links slide their underline in;
  - the mega-menu cascades;
  - page transitions in `template.tsx` become a 300 ms fade with a slight blur.
- **Hero network**: as specified in section 5.2, item 1. It is the one place to spend boldness. Everything else supports it.

## 8. "Find the right software" guide

- A scripted, deterministic guide. Do not call it AI, and do not imply a model or "assistant intelligence". Label it "Quick guide: find the right software".
- Put the decision tree in `src/domain/guide.ts` and test it. Every path ends in a recommendation that maps to a product in `content/products.ts`.
- Questions:
  1. What do you need? Options: accounting and GST; billing for a shop; payroll; Tally on phone or away from office; marketing and design; website or app; computers or CCTV.
  2. A follow-up per branch. For example, for accounting, ask how many people use it at once and reuse `adviseLicence`; for a shop, ask whether it is retail/FMCG (Busy) or a simple billing setup (Vyapar or Saral Billing).
  3. The guide ends with a recommendation card plus "Send on WhatsApp", prefilled through `buildEnquiry` and `whatsappUrl`.
- UI: a floating button on desktop (above the fold it waits 4 s before appearing) and a third action in the mobile bar. A chat-style panel with bot messages after a 600 ms typing indicator, answer chips, a Back option and Start over.
- Accessibility: focus moves into the panel, focus is trapped while it is open, Escape closes it, new messages announce through `aria-live="polite"`, and everything works by keyboard.

## 9. Content changes

- `business.ts`: email, sales email, Shop No. 16 address, Facebook and founder LinkedIn links, experience derived from `foundedYear`.
- New `content/products.ts` (single source for every product: slug, name, emoji key, category, one-liner, features, real prices with `Source` where they exist, related products), `content/emoji.ts`, `content/about.ts` (values, timeline) and `content/portfolio.ts` (empty).
- Refactor `TallySuite`, `BeyondTally` and the sliders to read from `products.ts` so nothing is listed twice.
- `robots.ts`: delete the comment claiming the old site blocked search engines. His live pages are set to index and follow, so that claim was wrong. Remove the same claim from README, HANDOFF and the specs.
- JSON-LD: keep `ProfessionalService`, add `sameAs` for Facebook, and add `Service` JSON-LD on each product page with the business as provider.

## 10. Performance, accessibility and SEO budgets

Run Lighthouse on the production build (`npx lighthouse http://localhost:4173/ --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./lighthouse-home.json`, and the same for `/tally-prime/`). Required:

- Performance 90 or above, Accessibility 95 or above, Best Practices 95 or above, SEO 95 or above, on mobile.
- LCP at most 2.5 s, CLS at most 0.05, TBT at most 200 ms.
- First Load JS per route at most 200 kB as reported by `next build` (report the numbers).
- Emoji WebP files at most 12 kB each; logo files at most 30 kB; Niket's photo stays as it is.
- One h1 per page, every image has alt (decorative ones empty), visible focus everywhere, no text below 4.5:1, all carousels and menus keyboard operable.

If a budget fails, cut decoration before cutting content.

## 11. Tests and checks

- Unit tests: `guide.ts` (every path ends in a valid product; no dead ends), `products.ts` integrity (every emoji key exists, every related slug exists, every price has a source), and the existing 32 tests still pass.
- Extend `scripts/smoke.py`:
  - every new route loads with one h1 and no console errors;
  - the ERP slider moves on its next button and on ArrowRight;
  - the mega-menu opens by keyboard and closes on Escape;
  - the services filter changes the visible cards;
  - the guide reaches a recommendation and opens WhatsApp with the product name in the message (stub wa.me as the existing test does);
  - with reduced motion emulated (`reduced_motion="reduce"`), the slider does not autoplay and all content is visible;
  - with JavaScript disabled, the home page text is all visible.
- Screenshots with `scripts/screenshot.py` of every page at 1440 px and 390 px, light and dark, plus a short screen recording or frame sequence of the hero load. Look at them and fix anything off before reporting.

## 12. Do not

- Break the static export, add a backend or call external APIs at runtime.
- Add analytics, trackers or third-party scripts, or load fonts or emoji from a CDN at runtime.
- Add dependencies beyond `motion`, `embla-carousel-react`, `embla-carousel-autoplay` and `sharp` (dev). If something else seems unavoidable, stop and explain first.
- Hard-code colours, durations, facts or prices in components.
- Reuse vendor posters or artwork, theme demo content, or anything from section 2.3.
- Present the guide as AI.
- Upscale the logo beyond its native resolution.

## 13. Phases

1. **Brand and facts**: logo pipeline, palette, `business.ts` and content files, routes renamed to his URLs, `/tally/` moved to `/tally-prime/`, nav, footer and sitemap. Checks, then screenshots.
2. **Foundations**: emoji pipeline and `<Emoji>`, motion tokens and variants, `motion-ready` gating, reduced-motion and save-data handling, ADR-0002, the AGENTS.md update. Checks.
3. **Home**: hero network, ticker, stats, statement, both sliders, insights bento, marketing grid, why us, clients marquee, about teaser, in his order. Checks, then screenshots.
4. **Inner pages**: product template and the five product pages, services with filters, portfolio, about timeline, contact. Checks.
5. **Guide**: domain tree with tests, then the UI. Checks.
6. **Quality pass**: Lighthouse budgets, the extended smoke test, screenshots in both themes and both widths, the no-JavaScript and reduced-motion runs.
7. **Docs**: write `specs/003-slice-03-brand-motion.md` (outcome, scope, contracts, acceptance criteria and a verification table with real results); update `constitution.md` (XI: motion rules and reduced motion; III: product prices carry sources), `docs/architecture.md`, README and HANDOFF. HANDOFF's "Before going live" table gains: partner tier, 1000+ clients claim, client logo permission, Biz Analyst prices, sales email, Vyapar referral code display, high-resolution logo.

## 14. Acceptance criteria

1. Every route in section 4 builds as static HTML with one h1, no console errors, and appears in `sitemap.xml`. `/tally/` is gone and nothing links to it.
2. His real logo shows in the header, and a clean on-dark variant in the footer. Favicons come from the "N" mark.
3. The palette uses his blue and ink, and every text pair passes AA in light and dark mode.
4. No content from section 2.3 appears anywhere.
5. The hero network, sliders, cascades, counters, marquee, mega-menu, spotlight cards and guide all work by mouse, touch and keyboard, and degrade correctly under reduced motion and without JavaScript.
6. Lighthouse budgets in section 10 are met on `/` and `/tally-prime/` (numbers reported).
7. `npm run check` and `scripts/smoke.py` pass, including every earlier journey.

## 15. Report

Report in this order: Delivered, Verified (commands, Lighthouse scores, First Load JS per route, smoke results), Not built, Next. Lead with what the visitor now sees. State deviations once.

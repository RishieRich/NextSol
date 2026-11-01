# Architecture: Next Solutions Website

Durable notes. Update when behavior, setup or structure changes, not on every commit.

## Shape

```text
src/content/*.ts  ──►  src/domain/*.ts  ──►  src/components/**  ──►  src/app/**/page.tsx  ──►  next build  ──►  out/ (static HTML)
 facts, prices,        rules, totals,        presentation only        page composition,                       any static host
 sample data           formatting                                     metadata

Enquiry: EnquiryForm ─► domain/enquiry.buildEnquiry ─► whatsappUrl ─► visitor's WhatsApp (nothing stored)
```

## Source of truth

| Fact | Owner module | Read by |
| --- | --- | --- |
| Name, phone, WhatsApp, address, hours, GSTIN | `content/business.ts` | Header, Footer, MobileActionBar, Hero, ContactBlock, CtaBand, AboutStory, JSON-LD |
| Tally list prices with sources | `content/tally.ts` (`editions`) | LicenceAdvisor, EditionsTable |
| Price and money formatting | `domain/format.ts` | every component showing ₹ |
| Silver or Gold rule | `domain/licence.ts` | LicenceAdvisor |
| Enquiry validation and message | `domain/enquiry.ts` | EnquiryForm |
| Invoice and report arithmetic | `domain/invoice.ts`, `domain/reports.ts` | InvoiceDemo, CustomisationPreviews |
| Every product: name, emoji, features, prices with sources, related | `content/products.ts` | product pages, services index, sliders, mega-menu, quick guide |
| Quick guide decision tree | `domain/guide.ts` | Guide |
| Tool arithmetic (GST, GSTIN, MSME interest, amount in words) | `domain/gst.ts`, `gstin.ts`, `msme.ts`, `words.ts` | tool pages |
| Colors (light and dark), type, motion tokens | `styles/theme.css` (motion numbers mirrored in `lib/motion.ts`) | every CSS module, Motion variants |
| Light / dark choice | `lib/theme.ts` (pre-paint script, `data-theme` on `<html>`, `localStorage` key `ns-theme`) | ThemeToggle, layout |
| Logo | `content/brand.ts`, `components/brand/Logo.tsx` | Header, Footer, hero network |
| Site URL | `lib/config.ts` | metadata, sitemap, robots, JSON-LD |

## Optional providers

| Provider | Purpose | Behavior when absent |
| --- | --- | --- |
| WhatsApp (wa.me) | Delivers enquiries | Visitor sees a direct link to retry, plus the phone number |
| Google Maps (link only) | Directions | Address is still printed in full |

## History model

None on any server. The visitor's own browser keeps only their light/dark choice and the invoice generator's draft. Content history is the git history of `src/content/`.

## Operations

- Seeding: not applicable; sample data is static in `content/samples.ts`.
- Migrations: not applicable.
- Health check: `python scripts/smoke.py <url>` against any deployed or local build.
- Deploy: `npm run build`, upload `ui/frontend/out/`. See README.

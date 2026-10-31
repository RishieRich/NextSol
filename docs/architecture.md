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
| Colors, type, motion | `styles/theme.css` | every CSS module |
| Logo | `content/brand.ts`, `components/brand/Logo.tsx` | Header, Footer |
| Site URL | `lib/config.ts` | metadata, sitemap, robots, JSON-LD |

## Optional providers

| Provider | Purpose | Behavior when absent |
| --- | --- | --- |
| WhatsApp (wa.me) | Delivers enquiries | Visitor sees a direct link to retry, plus the phone number |
| Google Maps (link only) | Directions | Address is still printed in full |

## History model

None. The site stores nothing. Content history is the git history of `src/content/`.

## Operations

- Seeding: not applicable; sample data is static in `content/samples.ts`.
- Migrations: not applicable.
- Health check: `python scripts/smoke.py <url>` against any deployed or local build.
- Deploy: `npm run build`, upload `ui/frontend/out/`. See README.

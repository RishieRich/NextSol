# Slice 01: static marketing site with WhatsApp enquiries

Part of: `specs/000-product-brief.md`. Status: verified.

## Outcome

A visitor can learn what Next Solutions offers, try the invoice toggle, the customisation explorer and the Silver or Gold advisor, and start a WhatsApp chat or call with their need already written out.

## In scope

- Pages: home, Tally, services, about, contact, 404.
- Hero invoice demo, customisation explorer (5 previews), licence advisor, editions table, FAQ.
- Enquiry form that validates, then opens WhatsApp with a pre-filled message.
- Header with mobile menu, footer, phone-only call and WhatsApp bar.
- SEO: per-page metadata, canonical URLs, LocalBusiness JSON-LD, sitemap, robots.
- Light and dark mode from the visitor's system setting.

## Out of scope

- Any server code, storage of enquiries, or email delivery.
- AI assistant, Gujarati or Hindi pages, analytics.

## Contracts

```text
content/business.ts   business: name, phone, whatsapp, address, hours, gstin, links
content/tally.ts      tallyServices[], editions{silver,gold} with Price{amountInr,basis,source}, customisations[], tallyFaqs[]
content/services.ts   serviceGroups[], processSteps[]
content/proof.ts      clients[], reviews[]
content/samples.ts    invented data for mock-ups, labelled as samples in the UI
content/brand.ts      brandLogo: { src, width, height } | null

domain/licence.ts     adviseLicence({usersAtOnce, locations}) -> {kind:"edition", edition} | {kind:"consult"}
domain/enquiry.ts     buildEnquiry(input) -> {ok:true, text} | {ok:false, errors}; whatsappUrl(e164, text?)
domain/invoice.ts     computeInvoice(lines, gstRate) -> lines with amounts, taxable, cgst, sgst, total
domain/reports.ts     assessProduction(row), checkStock(available, requested), outstandingTotals(rows)
domain/format.ts      formatInr, formatPrice, yearsSince, telHref
```

## Acceptance criteria

1. Every page loads with one h1 and no console errors.
2. Invoice toggle switches standard and customised.
3. Explorer tabs work by mouse and arrow keys.
4. Advisor gives Silver, Gold and consult answers for the matching inputs.
5. Enquiry form shows field errors, focuses the first one, then opens WhatsApp with the message.
6. Mobile menu opens and closes with Escape.

## Verification

| Criterion | How it was checked | Result |
| --- | --- | --- |
| 1 | `python scripts/smoke.py http://localhost:4173` (pages load) | Pass |
| 2 | smoke: hero invoice toggle | Pass |
| 3 | smoke: customisation explorer | Pass |
| 4 | smoke: licence advisor; `npm run test` (adviseLicence) | Pass |
| 5 | smoke: enquiry form; `npm run test` (buildEnquiry, whatsappUrl) | Pass |
| 6 | smoke: mobile menu | Pass |

## Notes

- Enquiries go through WhatsApp deep links because Vapi businesses already run on WhatsApp and a static site has no server to receive form posts.
- Tabular figures are used only in invoice tables: in Schibsted Grotesk they also widen commas and full stops, which looks broken in prose and prices.
- The next slice inherits `content/` as the only place facts live. Any new page reads from it.

# Product brief: Next Solutions Website

Created 2026-10-27. Owner: Rishi (ARQ ONE AI Labs), for Niket Naik, Next Solutions, Vapi.

## User and change

- User: the owner or accountant of a small business in and around Vapi, usually on a phone, deciding whether to buy, renew, customise or fix Tally.
- Change: today the site is offline every night (hosted on a laptop) and blocks search engines. When this works, the site is always up, shows up in search, explains what Next Solutions does in a minute, and turns interest into a WhatsApp chat or a call.

## Primary journey

A visitor lands on any page, understands what Next Solutions can do for their Tally, and starts a WhatsApp chat or phone call with their need already stated.

Everything in v1 exists to make that sentence true.

## Invariants

- Every fact about the business (name, phone, WhatsApp, address, hours, GSTIN) comes from `ui/frontend/src/content/business.ts` and nowhere else.
- Every price shown carries its source and date, and says it is before GST.
- Every invented company or figure on the site is labelled as a sample.
- No enquiry data is stored or sent anywhere except the visitor's own WhatsApp.
- The site builds to static files and needs no server at runtime.

## Assumptions

| Assumption | Default taken | Cost if wrong |
| --- | --- | --- |
| Shop address | LinkedIn version: 106, Bass Complex, GIDC Char Rasta, Vapi 396191 | One line in `business.ts` |
| WhatsApp number | Same as the phone, +91 97276 71017 | One line in `business.ts` |
| Brand blue | #1b5bd0, chosen to match "the blue he likes" until the real logo arrives | Three tokens in `theme.css` |
| Logo | Built-in N-and-chevron mark | Drop the file in `public/brand/`, fill `brand.ts` |
| Tally partner status | Not claimed anywhere on the site | Add the tier once confirmed |
| Customisation price | From ₹5,500, his own IndiaMART listing | One value in `tally.ts` |
| Insurance, architectural 3D | Insurance dropped; 3D kept under design | Edit `services.ts` |
| Language | English only | i18n is a later slice |
| Primary domain | https://nxtsolutions.in | `NEXT_PUBLIC_SITE_URL` |

## Non-goals

- A backend, database, admin panel or CMS. Content lives in typed files.
- An AI chat assistant. A later slice, behind a guard, once the base site is live and getting traffic.
- Online payment or ordering.
- Gujarati and Hindi versions.
- Analytics and cookie banners.

## Data

- Source: research on public listings (IndiaMART, Google listing mirror, LinkedIn) and Tally Solutions' published prices, gathered 2026-10-27.
- Provenance and date: price sources and dates live next to each price in `content/tally.ts` and render on the page.
- Labelled in the UI as sample data: yes. The invoice and report mock-ups use an invented company and say so.

## Acceptance criteria

1. All five pages (home, Tally, services, about, contact) build to static HTML with one h1 each and no console errors.
2. The hero invoice switches between standard and customised Tally styles.
3. The customisation explorer shows five previews, reachable by mouse and arrow keys.
4. The licence advisor recommends Silver for one user, Gold for several, and a conversation for several locations.
5. The enquiry form blocks invalid input with field-level messages, then opens WhatsApp with the need, name, business and mobile filled in.
6. Phone and WhatsApp are one tap away on every page on a phone.
7. `robots.txt` allows all crawlers and `sitemap.xml` lists every page.
8. Light and dark mode, keyboard focus and reduced motion all work.

## Verification commands

```bash
npm --prefix ui/frontend run check
python scripts/smoke.py http://localhost:4173
```

## Open questions

- Is Next Solutions a certified Tally partner, and at what tier?
- Which shop address and which WhatsApp number are correct?
- May the seven named clients be shown, and can any give a named testimonial?

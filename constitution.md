# Next Solutions Website constitution

Governing rules for this repository. Every rule below is adopted, which means it has one line of proof that can be checked. Rules this site does not need have been left out rather than left unproven.

Created 2026-10-27. Baseline: ARQ engineering constitution.

## I. The repository is the durable artifact

Lasting behavior, decisions, setup and continuation state live here, not in chat.

Proof: `specs/000-product-brief.md`, `specs/001-slice-01-static-site.md`, `specs/decisions/ADR-0001-stack.md`, `docs/architecture.md` and `HANDOFF.md` carry the state; `agents/AGENTS.md` carries the working rules.

## II. One fact has one authority

Every business fact, price and derived figure has one canonical source and one computation path. Components display facts, they do not recreate them.

Proof: business facts live only in `ui/frontend/src/content/business.ts`; prices in `content/tally.ts`; arithmetic and formatting in `src/domain/` with tests in `src/domain/domain.test.ts` and `src/domain/samples.test.ts` (`npm run test`).

## III. Evidence and provenance

Every price shown on the site carries where it came from and when.

Proof: the `Price` type in `content/tally.ts` requires a `source` with `url` and `asOf`; `LicenceAdvisor`, `EditionsTable` and `TallyFaq` render that source next to the figure.

## IV. Unsupported knowledge is explicit

Invented data is labelled, unknown facts are left out rather than guessed, and prices say they are list prices before GST.

Proof: every mock-up renders "Sample data" or "Sample invoice for an invented company"; `business.email` is `null` and every email reference is hidden; `priceNote` in `content/tally.ts` renders beside every price table.

## VI. Validation before commitment

Nothing leaves the page until it is valid.

Proof: `buildEnquiry` in `src/domain/enquiry.ts` validates name, need, phone and message length before any WhatsApp link is built; covered by `buildEnquiry` tests and the enquiry step of `scripts/smoke.py`.

## X. Structural privacy

The site stores no visitor data and sends enquiries only to the visitor's own WhatsApp.

Proof: there is no server, database, analytics or third-party script (`output: "export"` in `next.config.mjs`); `EnquiryForm` hands the message to `wa.me` and keeps nothing.

## XI. Design serves comprehension

Colors come from tokens, focus is visible, motion respects the visitor's setting, and meaning never rides on color alone.

Proof: `ui/frontend/src/styles/theme.css` holds every color and defines `:focus-visible` and `prefers-reduced-motion`; `scripts/verify.py` (ARQ skill) reports no hex values outside it; status pills and alerts carry text labels alongside color.

## XII. Completion is demonstrated

A feature is complete only when its acceptance criteria pass and known limits are stated.

Proof: `npm --prefix ui/frontend run check` (typecheck, lint, unit tests, build) and `python scripts/smoke.py <url>` (six journeys), with results recorded in `HANDOFF.md`.

## Conflicts

Where a rule conflicts with a product requirement, the conflict and its resolution are recorded in `specs/decisions/`.

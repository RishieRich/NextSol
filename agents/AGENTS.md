# Agent instructions: Next Solutions Website

Authoritative instructions for any coding agent working in this repository. Other agent files point here rather than restating this.

## Read first

1. `constitution.md` at the root. Every rule listed there is adopted and provable.
2. `specs/000-product-brief.md` for the outcome, the primary journey, invariants and non-goals.
3. `HANDOFF.md` for what is verified and what is next.
4. `specs/decisions/` before changing anything structural.

## Non-negotiables

- One fact, one authority. Business facts live in `ui/frontend/src/content/`. Arithmetic and formatting live in `ui/frontend/src/domain/`. Components never compute or hard-code either.
- Every price carries a `source` with a date. No price without one. This includes product prices in `content/products.ts` and tool rates in `content/tools.ts`.
- Invented data stays in `content/samples.ts` and is labelled as a sample wherever it renders.
- Missing facts stay missing. Do not fill in an email, a partner tier, a client count or a testimonial that Niket has not confirmed.
- Colors, shadows, radii, fonts and motion come from `ui/frontend/src/styles/theme.css`. A hex or rgb value in a component or CSS module is a bug.
- Accessibility is structural: visible focus, semantic labels, reduced motion, readable contrast, no meaning by color alone.
- The site must stay a static export. No feature that needs a server without a new ADR.
- Completion is demonstrated. Never report a check that was not run.

## Boundaries

```text
app/ (pages, metadata)  →  components/ (presentation)  →  domain/ (rules, totals, formatting)  →  content/ (facts, prices, samples)
```

`domain/` imports no React and no Next. `content/` imports only types. CSS Modules need a local class in every selector.

## Working rules

- Make the smallest coherent change that satisfies the outcome.
- To change a phone number, address, price or service: edit `content/`, not components.
- Reproduce a defect or identify the failing invariant before changing code.
- Run `npm run check` in `ui/frontend` and `python scripts/smoke.py` against a local build before handoff.
- Update `HANDOFF.md` when continuation state changed.

## Theme

Next Solutions blue: deep brand blue (`--ns-blue`), navy bands (`--ns-navy`), amber accents used sparingly (`--ns-amber`), paper-white document mock-ups (`--ns-doc-*`) that stay white in dark mode. Requested color changes are made in the token layer, then every derived state is checked: hover, focus, selected, light, dark, and the document tokens.

Typography: Schibsted Grotesk only. Use `.tabular` only on number columns in tables; in this typeface tabular figures also widen commas and full stops.

Light and dark: the system setting decides until the visitor presses the header switch, which sets `data-theme` on `<html>` and remembers it (ADR 0003). Any CSS that changes by theme must use both `:root[data-theme="dark"]` and `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`, never the media query alone. Check every visual change in both themes.

Motion (ADR 0002): Motion for React (`LazyMotion`, `m.*`) and Embla for sliders, nothing else. Use the variants in `src/lib/motion.ts` and the motion tokens, never ad-hoc numbers. Hidden starting states apply only under `motion-ready`, so every page reads fully without JavaScript. Reduced motion and save-data turn off autoplay, parallax, float, pulses and tilt. Animate only transform, opacity, filter, clip-path and path length. At most one decorative loop per viewport besides the logo marquee, paused off-screen by `LoopController`. The hero network is the one place to spend boldness.

## Commands

```bash
cd ui/frontend && npm install
npm --prefix ui/frontend run dev
npm --prefix ui/frontend run check        # typecheck, lint, unit tests, static build
python scripts/serve.py 4173 ui/frontend/out    # serve the build the way a static host would
python scripts/smoke.py http://localhost:4173    # set CHROME_PATH to your Chrome binary
SCHEMES=light,dark python scripts/screenshot.py http://localhost:4173 <out-dir> / /tally-prime/   # Git Bash: prefix MSYS_NO_PATHCONV=1
```

## Report format

Delivered, then Verified, then Not built, then Next. Lead with the outcome. State deviations once.

# ADR 0003: light and dark mode switch

Date 2026-11-01. Status: accepted.

## Context

The site followed the visitor's system setting only. The token layer already honoured a `data-theme` attribute on `<html>`, but there was no way for a visitor to choose. Niket asked for a visible light and dark mode switch.

## Decision

- A round sun / moon button in the header (`components/layout/ThemeToggle.tsx`), at every width: after "Get a quote" on desktop, beside the menu button on phones. It is a toggle button named "Dark mode" with `aria-pressed`.
- With no choice made, the system setting decides, as before. Pressing the switch writes `data-theme="light"` or `"dark"` on `<html>` and remembers it in `localStorage` under `ns-theme`.
- A pre-paint inline script (`THEME_SCRIPT` in `lib/theme.ts`) applies the remembered choice before first paint, so a reload never flashes the wrong theme. It fails safe: if storage is blocked, the system setting decides.
- The switch's icon is chosen by CSS from the theme on `<html>`, so it is right on first paint without waiting for hydration.
- The logo renders both files (`logo-transparent.webp`, `logo-on-dark.webp`) and CSS shows the one for the current theme. A `<picture media="(prefers-color-scheme: dark)">` could not follow the switch.
- The browser's `theme-color` meta tags follow the choice (`syncThemeColor`).
- The change is instant in one frame (`theme-switching` class turns transitions off), cross-faded by a view transition where the browser supports it and motion is not reduced. A choice made in another tab follows through the `storage` event.

## Constraints this creates

- Every color still comes from `styles/theme.css`. The two dark blocks there (system dark and `data-theme="dark"`) must stay identical.
- Any CSS that changes by theme uses both selectors: `:root[data-theme="dark"]` and `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`. Never the media query alone.
- `localStorage` holds only the visitor's own theme choice in their browser. Nothing is sent anywhere, so constitution rule X still holds.

## Alternatives considered

| Option | Why not |
| --- | --- |
| `next-themes` | A dependency for about 80 lines of code; ADR 0002 limits dependencies |
| Three states (light, dark, system) | A two-state switch is clearer; the system setting still decides until the visitor chooses |
| Cookie and server-rendered theme | Needs a server; the site is a static export |

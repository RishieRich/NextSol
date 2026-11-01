# ADR 0002: motion and slider libraries

Date 2026-10-31. Status: accepted. Supersedes the "no animation library" line in ADR 0001.

## Context

Slice 03 (`specs/003-brand-and-motion-upgrade.md`) asks for a premium, moving site: cascading reveals, a circuit-network hero, counters and rings, product sliders, a logo marquee, a mega-menu and pointer effects. It must stay fast on a mid-range Android phone on 4G, readable without JavaScript, and calm under reduced motion. CSS alone covers loops and hovers but not layout transitions, scroll-linked values, drag-and-swipe sliders, or reveals that are tied to the viewport.

## Decision

| Job | Library | How it is used |
| --- | --- | --- |
| Reveals, cascades, scroll-linked values, layout transitions, the hero network | `motion` ^14.9.0 (Motion for React, MIT) | `LazyMotion` with `domAnimation` and `m.*` components only (`strict`); `domMax` is loaded only where layout animation is needed (`lib/motionMax.ts`) |
| Sliders | `embla-carousel-react` and `embla-carousel-autoplay` ^8.6.0 (MIT) | One `Slider` component (`components/motion/Slider.tsx`) for every carousel |
| Build-time images (logo variants, favicons, emoji WebP) | `sharp` ^0.35.5, dev only | `scripts/brand-assets.mjs`, `scripts/fetch-emoji.mjs` |

Nothing else: no GSAP, no smooth-scroll hijacking, no Three.js, no Lottie, no particle library. One library per job.

## Rules this creates

- Shared numbers live in `styles/theme.css` (motion tokens) and are mirrored in `lib/motion.ts` (`motionTokens`, `fadeUp`, `cascade`, `scaleIn`, `drawPath`, `wordReveal`). Components use these, never ad-hoc numbers.
- No content depends on JavaScript to become visible. Hidden starting states apply only under the `motion-ready` class that the inline head script (`lib/motionReady.ts`) adds before first paint.
- Reduced motion (`MotionConfig reducedMotion="user"` plus the CSS rule in `theme.css`) turns off autoplay, parallax, float, pulses and tilt, and makes reveals instant. `navigator.connection.saveData` adds `save-data`, which turns off decorative loops.
- Animate only `transform`, `opacity`, `filter` (small blur), `clip-path` and `stroke-dashoffset` / `pathLength`.
- At most one decorative loop is visible per viewport besides the logo marquee. `LoopController` pauses every `[data-loop]` element when it is off-screen or the tab is hidden.
- `PointerEffects` is the only pointer listener for spotlight, tilt and magnetic pull, on devices with a fine pointer and hover only.

## Consequences

- First Load JS rises by the Motion and Embla runtimes; the budget is 200 kB per route (spec section 10), checked at the end of each slice.
- `scripts/smoke.py` runs the site with reduced motion and with JavaScript off, and fails if any text is left hidden.

## Revisit when

A page needs an effect these two libraries cannot do within the rules above. Record the new library and the reason here before adding it.

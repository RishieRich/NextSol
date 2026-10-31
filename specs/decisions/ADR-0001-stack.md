# ADR 0001: stack and hosting

Date 2026-10-27. Status: accepted.

## Context

A public marketing site where search visibility matters, run by a two-to-ten person business with no one to maintain servers. The current site runs on a laptop and goes down every night. Content changes a few times a year.

## Decision

- Frontend: Next.js 16 (App Router), React 19, TypeScript strict, CSS Modules on a token layer (`src/styles/theme.css`). No CSS framework, no animation library.
- Backend: none. `output: "export"` builds static HTML. Enquiries open WhatsApp with a pre-filled message.
- Storage: none. Content lives in typed files under `src/content/`.
- Model provider: none in v1.
- Hosting: any static host. Recommended: Vercel, Netlify or Cloudflare Pages on their free tiers, with the nxtsolutions.in domain pointed at it.
- Font: Schibsted Grotesk, self-hosted through `@fontsource-variable`, so no runtime call to Google Fonts.

## Constraints this creates

- No server features: no API routes, server actions, redirects, rewrites or image optimisation (Next.js static export limits). Images are pre-sized in `public/`.
- Request payload and timeout ceilings: not applicable, there are no requests to the site beyond static files.
- Region and latency: static files served from the host's CDN.
- Other: `NEXT_PUBLIC_SITE_URL` is baked in at build time; changing the domain means a rebuild.
- Folder note: there is no `ui/backend/`. Domain rules live in `ui/frontend/src/domain/` because they run in the browser, and Next.js does not compile files outside its app root without extra config. The boundary rule still holds: `domain/` imports no React and no Next.

## Alternatives considered

| Option | Why not |
| --- | --- |
| React + Vite (ARQ default) | Client-rendered pages are weaker for search, and search is the point of this site |
| WordPress | Needs a PHP server and updates; the server is the current problem |
| Next.js with a Node server | A server to keep alive for no runtime feature that needs one |
| Tailwind CSS | ARQ uses plain CSS with tokens; components reference variables only |

## Revisit when

Niket wants something only a server can do: storing enquiries, an AI assistant that calls a model with a secret key, a booking or payment flow. Then add route handlers on a server deployment, or a small API, and record it in ADR 0002.

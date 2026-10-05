# NHS — Next Higher Solution

Marketing site for **NHS Autopilot**, an AI automation agent for scheduled/automated
reminders with a built-in CRM. Dark, monospace, scroll-driven.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 (CSS-first `@theme`) ·
GSAP 3 + ScrollTrigger · Lenis smooth scroll. No component library, no Framer Motion.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Where to change things

**All copy and data live in `content/` — never in JSX.** Swap these before launch
(each file is marked `PLACEHOLDER COPY`):

| File | What it holds |
|---|---|
| `content/site.ts` | Brand name, product name, tagline, description, email/phone, nav, socials, `domain` |
| `content/method.ts` | The 5-step Autopilot flow (also drives the preloader labels + nav dots) |
| `content/services.ts` | Service groups (first group = flagship Automation & CRM) |
| `content/case-studies.ts` | Case studies (slugs generate `/case-studies/[slug]` pages) |
| `content/testimonials.ts` | Testimonial quotes |
| `content/about.ts` | Manifesto, team, milestones |

- **Accent color / theme tokens:** `app/globals.css` (`@theme` block — `--color-accent` is the acid lime).
- **Client logos & case-study covers:** currently rendered as styled placeholders (invented names / CSS gradients). Replace with real assets in `public/` and wire `next/image` when ready.
- **Contact form delivery:** `app/api/contact/route.ts` validates with zod and logs. Wire a real provider (Resend/Postmark/CRM) where the `TODO` is.

## How the scroll system works

- **`components/layout/SmoothScroll.tsx`** creates Lenis and drives it from GSAP's
  ticker (`gsap.ticker.add(lenis.raf)`) so ScrollTrigger and Lenis never desync.
  Under `prefers-reduced-motion` Lenis is skipped entirely (native scroll).
- **`lib/gsap.ts`** is the single place GSAP plugins are registered. Always import
  `{ gsap, ScrollTrigger }` from here, never from `"gsap"` directly.
- **`components/layout/ThemeSection.tsx`** produces the dark↔light flips with a
  clip-path wipe tied to scroll; children read `--fg` / `--fg-muted`.
- **`components/sections/MethodHorizontal.tsx`** is the pinned horizontal centerpiece.
- **`components/layout/ScrollRefresh.tsx`** refreshes ScrollTrigger after fonts load
  and resets scroll on route change.

Animation primitives live in `components/ui/` (`SplitText`, `Reveal`, `Marquee`,
`MagneticLink`, `Button`). Every animation is wrapped in `gsap.context()`, reverted on
unmount, and respects reduced motion.

## Known gotchas

- **Refresh after fonts load.** Pin distances are measured against font metrics, so
  `document.fonts.ready.then(() => ScrollTrigger.refresh())` runs in both
  `MethodHorizontal` and `ScrollRefresh`. Don't remove it or the pinned section ends early.
- **Horizontal track math.** The track translates by `-((n-1)/n)*100`% computed from
  the phase count — not a hardcoded `-80`. Add/remove a phase and it still lands right.
- **The `matchMedia` breakpoint.** Below 1024px (and under reduced motion) the pinned
  section falls back to a plain vertical stack via `gsap.matchMedia()`. Keep that branch.
- **`SplitText` groups characters by word** (each word is `nowrap`) so headings never
  break mid-word. Keep that structure if you edit it.
- **Preloader** shows once per session (`sessionStorage`). Clear it to see it again.
- **Turbopack root** is pinned in `next.config.ts` to ignore stray lockfiles outside the project.

## Routes

`/` · `/services` · `/case-studies` (+ `/case-studies/[slug]`, statically generated) ·
`/about` · `/contact` · `POST /api/contact`. Plus `sitemap.xml`, `robots.txt`, and a
generated OpenGraph image (`app/opengraph-image.tsx`).

## Deploy

Any Next.js host works; Vercel is simplest. Set the real domain in `content/site.ts`
(`domain`) so metadata, canonical URLs, sitemap, and robots resolve correctly.

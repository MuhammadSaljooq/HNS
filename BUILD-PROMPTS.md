# Build Prompt Pack — Software Consultancy Site

A sequenced set of prompts for building a dark, monospace, scroll-driven consultancy site in VS Code.
Inspired by the *mechanics* of weevolveit.com, not its layout or copy.

**Stack:** Next.js (App Router) · TypeScript · Tailwind v4 · GSAP ScrollTrigger · Lenis

---

## How to use this pack

1. Run **Prompt 0** in your terminal by hand. It's a scaffold command, not an AI task.
2. Paste **Prompt A (Project Context)** once at the start of your session. Every later prompt assumes it.
3. Work through prompts **1 → 24 in order**. Each one is self-contained and ends with acceptance criteria.
4. After each prompt, run `npm run dev` and confirm the criteria before moving on. Scroll animations compound — one broken pin breaks everything below it.
5. Where a prompt says `[DECIDE]`, substitute your own value first.

**Your decisions to make before starting:**

| Token | Value |
|---|---|
| Company name | `[DECIDE]` |
| Accent color | `#c8f751` (acid lime) — or swap for your brand |
| Domain | `[DECIDE]` |
| Tagline | `[DECIDE]` |

---

## Prompt 0 — Scaffold (run this yourself, in the terminal)

```bash
npx create-next-app@latest evolve-consultancy \
  --typescript --tailwind --eslint --app --src-dir=false \
  --import-alias "@/*"

cd evolve-consultancy
npm install gsap lenis clsx tailwind-merge
code .
```

Notes:
- **GSAP ScrollTrigger is free** and included in the core `gsap` package. You do not need a club license for anything in this build.
- We write our own text splitter rather than using GSAP's SplitText, so there is no plugin-licensing question at all.
- `lenis` is the current package name (it was formerly `@studio-freight/lenis` — ignore older tutorials).

---

## Prompt A — Project Context (paste once, first)

```
I'm building a software consultancy marketing site. Here is the full context for
everything we do this session — refer back to it rather than asking me to repeat it.

STACK
- Next.js App Router, TypeScript, Tailwind v4 (CSS-first @theme config, not tailwind.config.js)
- GSAP 3 with ScrollTrigger for scroll animation
- Lenis for smooth scrolling
- No component library. No Framer Motion. No shadcn.

DESIGN LANGUAGE
- Near-black base (#0B0B0C), off-white light sections (#EDEDEA)
- Everything monospace. JetBrains Mono for body/UI, Geist Mono for display headlines.
- ONE accent color: #c8f751 (acid lime). Used sparingly — a single dot, one word
  in a headline, one button. Never as a large fill.
- Faint dot-grid texture over dark sections (radial-gradient, ~24px pitch, 4% opacity)
- Huge display type. Hero headline should hit ~clamp(3rem, 11vw, 12rem), tight
  leading (0.9), slight negative tracking.
- Generous vertical rhythm. Sections breathe: min-h-screen or py-32 minimum.
- Labels and eyebrows are uppercase, letter-spaced ~0.2em, small (11-12px), dimmed.
  Format them like [ SECTION NAME ] with literal brackets.

MOTION PRINCIPLES
- Smooth scroll everywhere via Lenis, synced to GSAP's ticker.
- Text reveals are per-character or per-word, staggered, clipped by a parent
  with overflow:hidden — letters rise from behind a mask.
- Default easing: "power3.out" for entrances, "power2.inOut" for transitions.
- Default entrance duration: 0.8s, stagger 0.02s for chars / 0.06s for words.
- Sections that change theme do so with a clip-path wipe, not a fade.
- EVERY animation must be wrapped in gsap.context() and reverted on unmount,
  and must respect prefers-reduced-motion.

CODE CONVENTIONS
- All animated components are client components ("use client").
- Use useIsomorphicLayoutEffect (a helper we'll write) instead of useLayoutEffect,
  to avoid SSR warnings.
- Register GSAP plugins in exactly one place: lib/gsap.ts. Import from there.
- Copy and data NEVER live in JSX. They live in typed arrays under content/.
- Tailwind classes only; no CSS modules. Global keyframes go in app/globals.css.
- Every component gets explicit TypeScript prop types. No `any`.

Acknowledge with one line, then wait for my first task.
```

---

# PHASE 1 — Foundation

## Prompt 1 — Design tokens and global styles

```
Set up app/globals.css for Tailwind v4 using the CSS-first @theme directive.

Define these tokens:
  --color-ink: #0B0B0C          (dark base)
  --color-ink-soft: #141416     (raised dark surface)
  --color-paper: #EDEDEA        (light section base)
  --color-paper-soft: #DEDEDA
  --color-accent: #c8f751
  --color-muted-dark: rgba(237,237,234,0.55)
  --color-muted-light: rgba(11,11,12,0.55)
  --font-mono: JetBrains Mono, ui-monospace, monospace
  --font-display: Geist Mono, JetBrains Mono, monospace

Also add:
1. A .dot-grid utility class: a radial-gradient dot pattern, 1px dots, 24px pitch,
   currentColor at 5% opacity, that sits as a background layer.
2. Global keyframes for `marquee` (translateX 0 to -50%) and `blink`.
3. Base styles: html { scroll-behavior: auto } — IMPORTANT, Lenis handles smoothing
   and native smooth-scroll fights it. Body gets bg-ink, text-paper, font-mono,
   antialiased, overflow-x-hidden.
4. A @media (prefers-reduced-motion: reduce) block that disables all animation
   and transition durations globally.
5. Custom selection colors using the accent.

Then wire fonts in app/layout.tsx using next/font/google for JetBrains_Mono and
Geist_Mono, exposing them as CSS variables --font-jetbrains and --font-geist,
and point the @theme font tokens at those variables.

ACCEPTANCE: npm run dev renders a near-black page in monospace with no font flash
and no horizontal scrollbar.
```

## Prompt 2 — Utilities and the GSAP entry point

```
Create three small files.

lib/utils.ts
- export cn(...inputs) combining clsx and tailwind-merge.
- export a clamp(value, min, max) helper.

lib/useIsomorphicLayoutEffect.ts
- Export a hook that is useLayoutEffect in the browser and useEffect on the server.

lib/gsap.ts
- "use client"
- Import gsap and ScrollTrigger, call gsap.registerPlugin(ScrollTrigger) exactly once
  (guard against double registration in dev with a module-level boolean).
- Set gsap.defaults({ ease: "power3.out", duration: 0.8 }).
- Set ScrollTrigger.config({ ignoreMobileResize: true }).
- Export { gsap, ScrollTrigger }.
- Export a helper `prefersReducedMotion()` that reads the media query safely
  (returns false during SSR).

Every other file in the project imports GSAP from lib/gsap.ts, never from "gsap"
directly. This is what keeps plugin registration from breaking under Turbopack.

ACCEPTANCE: importing { gsap } from "@/lib/gsap" in a client component and logging
gsap.version prints a 3.x version with no plugin warnings in the console.
```

## Prompt 3 — Smooth scroll provider

```
Create components/layout/SmoothScroll.tsx.

A client component that wraps children and sets up Lenis:
- Instantiate Lenis with: duration 1.2, easing t => Math.min(1, 1.001 - 2**(-10*t)),
  smoothWheel true, touchMultiplier 1.5.
- CRITICAL: drive Lenis from GSAP's ticker rather than its own RAF loop, so
  ScrollTrigger and Lenis never desync:
    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  and tear all three down on unmount.
- Skip Lenis entirely when prefersReducedMotion() is true — just render children.
- Expose the instance on a React context so other components can call
  lenis.scrollTo() (the nav anchors will need this).
- Export a useLenis() hook returning the instance or null.

Then wrap the app body in app/layout.tsx with <SmoothScroll>.

ACCEPTANCE: scrolling feels weighted and eased rather than snappy. Resizing the
window does not break scroll position. No "ScrollTrigger update" console errors.
```

## Prompt 4 — Content layer

```
Create the content/ directory with typed data. No copy anywhere else in the app.

content/site.ts
  export const site = { name, tagline, description, email, phone, whatsapp,
  location, socials: [{label, href}], nav: [{label, href, children?}] }
  Nav items: Services, Method, Case Studies, About, Contact.
  Services and Case Studies have children (dropdown items).

content/method.ts
  export type Phase = { id: string; index: string; title: string; claim: string;
  points: string[] }
  Five phases. index is a zero-padded string: "01".."05".
  Use these as placeholders, in my own voice, NOT copied from any existing site:
    01 Discover — a claim about asking the right question before writing code
    02 Diagnose — a claim about measurement
    03 Design — a claim about outcomes over software
    04 Deliver — a claim about adoption
    05 Evolve — a claim about ongoing partnership
  Each phase gets 3 short lowercase bullet points.

content/services.ts
  export type ServiceGroup = { title: string; services: {name, href, blurb, flag?}[] }
  Four groups: Software & Product / Cloud, Data & AI / Business Systems / Growth.
  flag can be "ai" or "popular" for badge rendering.

content/case-studies.ts
  export type CaseStudy = { slug, client, industry, year, headline, summary,
  services: string[], metrics: {label, value}[], cover: string }
  Write 6 placeholder studies across different industries.

content/testimonials.ts
  export type Testimonial = { quote, author, role, company, rating }
  Five entries.

Mark the top of every file with a comment: "PLACEHOLDER COPY — replace before launch".

ACCEPTANCE: files typecheck, and importing them anywhere gives full autocomplete.
```

---

# PHASE 2 — Chrome

## Prompt 5 — Preloader

```
Create components/layout/Preloader.tsx — a full-screen intro overlay.

BEHAVIOR
- Covers the viewport at z-[100], bg-ink, on first mount only (use sessionStorage
  so it does not replay on client-side navigation within the session).
- Centered: a huge percentage counter in font-display, ~clamp(4rem,14vw,11rem),
  showing 000% ticking up to 100%. Zero-pad to three digits.
- The counter is driven by a GSAP tween on a proxy object {v: 0} to {v: 100},
  duration 2.2, ease "power2.inOut", with onUpdate writing to a ref'd DOM node.
  Do NOT drive it with React state — that's 100 re-renders.
- Beneath it, a row of five phase labels (DISCOVER DIAGNOSE DESIGN DELIVER EVOLVE)
  in small uppercase letter-spaced type. Each one brightens from 25% to 100% opacity
  as the counter crosses 20/40/60/80/100.
- On completion: the counter fades, then the whole overlay exits with a clip-path
  wipe from `inset(0 0 0 0)` to `inset(0 0 100% 0)`, duration 1, ease "power4.inOut".
- Fire a callback / custom window event "preloader:done" when the exit finishes,
  so the hero can start its own entrance.
- Lock body scroll (and lenis.stop()) while the preloader is up; release on exit.
- If prefersReducedMotion(), skip straight to done on the next frame.

ACCEPTANCE: hard refresh shows the counter animating smoothly at 60fps, the labels
light in sequence, the overlay wipes upward, and the page beneath is scrollable
immediately after. Navigating to another route and back does not replay it.
```

## Prompt 6 — Floating pill navigation

```
Create components/layout/Nav.tsx.

STRUCTURE
- Fixed, top-6, centered, max-w-6xl, w-[calc(100%-3rem)], z-50.
- A pill: rounded-full, bg-ink-soft/70, backdrop-blur-xl, border border-white/10,
  px-8, h-16, flex items-center justify-between.
- Left: wordmark. Company name where the last two characters are accent-colored.
  Beneath it, a row of five 4px dots — one per method phase — the last one accent.
- Center: nav links, uppercase, 12px, tracking-[0.15em]. Items with children get a
  small ▾ and open a dropdown.
- Right: a search icon button and a primary CTA button.

BEHAVIOR
- On scroll down past 100px the pill shrinks (h-16 → h-14) and its background
  opacity increases; on scroll up it restores. Animate with GSAP, not CSS transitions
  on every scroll event — use a single quickTo tween.
- Hide the pill entirely when scrolling down past 60% of viewport height, show it
  again on any upward scroll. Use ScrollTrigger's onUpdate with direction.
- Dropdowns: open on hover (desktop) / tap (mobile), animate in with a clip-path
  reveal from the top plus a 0.03s stagger on the items. Close on outside click,
  Escape, and route change.
- Links to same-page anchors should call lenis.scrollTo(target, { offset: -100 }).
- Mobile (<1024px): collapse to a wordmark plus a hamburger that opens a full-screen
  panel with large stacked links and a per-item stagger.

ACCESSIBILITY: dropdown triggers are <button> with aria-expanded and aria-controls.
The mobile panel traps focus and is dismissible with Escape.

ACCEPTANCE: pill floats over content, shrinks and hides correctly, dropdowns are
keyboard navigable, mobile menu works at 375px wide.
```

## Prompt 7 — Scroll progress readout

```
Create components/layout/ScrollProgress.tsx.

A fixed element pinned to the right edge, vertically centered, z-40, hidden below lg.
- A thin 1px vertical rule, ~120px tall, in white/15.
- A short accent-colored tick that travels down the rule as the page scrolls.
- To its right, a three-digit percentage label (e.g. "047%") in 10px letter-spaced
  mono, dimmed.
- Driven by a single ScrollTrigger on document.body with scrub: true — update the
  tick's y via gsap.quickSetter and the label via textContent. No React state.
- The whole thing fades in only after the preloader finishes, and fades out when
  the footer enters the viewport.

ACCEPTANCE: the number matches actual scroll position within 1%, and scrubbing is
perfectly smooth with no jitter.
```

---

# PHASE 3 — UI primitives

## Prompt 8 — SplitText and Reveal

```
Create two reusable animation primitives.

components/ui/SplitText.tsx
- Props: { children: string; as?: ElementType; by?: "char" | "word";
  stagger?: number; delay?: number; trigger?: "scroll" | "mount" | "manual";
  className?: string; play?: boolean }
- Splits the string into spans. Each unit is wrapped in an outer span with
  overflow-hidden and display inline-block, containing an inner span that gets
  animated — this is what produces the "rising from behind a mask" effect.
- Preserve spaces between words (use a non-breaking space span so layout holds).
- Animation: inner spans from { yPercent: 110, opacity: 0 } to { yPercent: 0,
  opacity: 1 }, duration 0.9, ease "power3.out", stagger as given
  (default 0.02 for chars, 0.06 for words).
- trigger "scroll" creates a ScrollTrigger at "top 85%" with once: true.
  trigger "mount" plays immediately. "manual" plays when the `play` prop flips true.
- CRITICAL a11y: the wrapper element carries aria-label={children} and the split
  spans are aria-hidden, so screen readers read the sentence, not 40 letters.
- Reduced motion: render the plain string with no spans at all.
- Everything inside a gsap.context() scoped to a container ref, reverted on cleanup.

components/ui/Reveal.tsx
- Props: { children; y?: number; delay?: number; duration?: number;
  start?: string; once?: boolean; className? }
- Generic scroll-triggered entrance: from { y: y ?? 40, opacity: 0 }, default
  start "top 85%", once true.
- Same context/cleanup/reduced-motion discipline.

ACCEPTANCE: a headline using SplitText animates letter by letter on scroll into view,
and inspecting it in the accessibility tree shows a single readable string.
```

## Prompt 9 — Marquee, MagneticLink, Button

```
Three more primitives.

components/ui/Marquee.tsx
- Props: { children: ReactNode; speed?: number; direction?: "left" | "right";
  pauseOnHover?: boolean; className? }
- Renders children twice inside a flex track and animates the track with GSAP
  (xPercent 0 → -50, repeat -1, ease "none", duration 1/speed scaled by content width).
- Seamless loop — measure the first copy's width and set duration from it so speed
  is consistent regardless of content length.
- Optional: modulate playback rate slightly with scroll velocity via Lenis for a
  nice "marquee speeds up as you scroll" touch. Keep it subtle (max 2x).

components/ui/MagneticLink.tsx
- Props: { children; strength?: number (default 0.3); className? }
- On mousemove within the element's bounds, translate the inner content toward the
  cursor by (offset * strength), using gsap.quickTo for x and y.
- Snap back with ease "elastic.out(1, 0.4)" on mouseleave.
- Disabled entirely on touch devices and under reduced motion.

components/ui/Button.tsx
- Variants: "primary" (accent bg, ink text), "ghost" (border white/20, transparent),
  "link" (underline offset animated on hover).
- All variants: rounded-full, uppercase, 12px, tracking-[0.15em], px-7 h-12.
- Hover on primary: a fill sweep — a pseudo-element that scales from the bottom,
  with the label color inverting. Pure CSS transition, no JS.
- Accepts href (renders Link) or onClick (renders button). Discriminated union props.

ACCEPTANCE: marquee loops with no visible seam or jump, magnetic links feel springy
not laggy, buttons are keyboard focusable with a visible accent focus ring.
```

---

# PHASE 4 — Homepage sections

## Prompt 10 — Hero

```
Create components/sections/Hero.tsx.

LAYOUT
- min-h-screen, flex column, centered, with the .dot-grid background layer.
- Eyebrow: [ YOUR TAGLINE ] in small bracketed uppercase, accent dot before it.
- Headline: two lines, font-display, clamp(3rem, 11vw, 12rem), leading-[0.88],
  tracking-[-0.04em]. Second line ends with an accent-colored period.
- Subhead: max-w-2xl, centered, text-muted-dark, leading-relaxed, ~2 sentences.
- Two buttons: primary CTA and a ghost "See our method" that lenis-scrolls to #method.
- A scroll cue at the bottom: a thin vertical line with a dot that loops downward.

ANIMATION
- Entrance is gated on the "preloader:done" event — listen for it, then play.
  If the preloader was skipped (session storage), play on mount.
- Timeline order: eyebrow fades up (0.4) → headline line 1 SplitText by char →
  headline line 2 SplitText by char overlapping by 0.3 → subhead words →
  buttons fade up together → scroll cue.
- Parallax on scroll: the whole hero content translates y +15% and fades to 0 opacity
  as the section scrolls out, with scrub: true. The dot-grid moves at a different
  rate (+30%) for depth.

ACCEPTANCE: after the preloader wipes, the headline builds character by character
without layout shift, and scrolling down drifts the hero away smoothly.
```

## Prompt 11 — Logo marquee and stats bar

```
Create components/sections/LogoMarquee.tsx and components/sections/StatsBar.tsx,
then a combined section that overlaps them.

LogoMarquee
- Full-bleed row of client logos using the Marquee primitive, speed low.
- Logos render at opacity 40%, grayscale, and go to 100% + accent-tinted on hover.
- Mask the left and right edges with a CSS mask-image linear-gradient so logos
  fade out rather than hard-cutting at the viewport edge.
- Use placeholder SVGs in public/logos/ — generate 8 simple wordmark SVGs with
  invented company names. Do NOT use real company logos.

StatsBar
- A rounded-full pill, bg-ink-soft/80, backdrop-blur, border white/10,
  centered and overlapping the marquee vertically (absolute, -translate-y-1/2).
- Four stats separated by a middot: years, projects delivered, countries, rating.
- Each number counts up from 0 when the bar scrolls into view, once, using a GSAP
  proxy tween (same technique as the preloader, no React state).

ACCEPTANCE: logos scroll infinitely with faded edges, the stats pill sits on top,
and the numbers count up exactly once when first seen.
```

## Prompt 12 — Theme wipe wrapper

```
Create components/layout/ThemeSection.tsx — this produces the dark↔light flips.

Props: { theme: "dark" | "light"; children; className? }

MECHANIC
- The section renders with its own background layer as an absolutely positioned
  child at -z-10 (bg-paper for light, bg-ink for dark).
- That background layer starts at clip-path: inset(100% 0 0 0) — fully hidden from
  the top — and animates to inset(0% 0 0 0) as the section enters, driven by a
  ScrollTrigger with start "top bottom", end "top 40%", scrub: 0.6.
- Text colors inside flip via a data-theme attribute on the section plus CSS
  variables, so children don't each need conditional classes:
    [data-theme="light"] { --fg: var(--color-ink); --fg-muted: var(--color-muted-light) }
    [data-theme="dark"]  { --fg: var(--color-paper); --fg-muted: var(--color-muted-dark) }
  and children use text-[var(--fg)].
- Light sections get the dot-grid too, at lower opacity.
- Reduced motion: no clip animation, background is simply present.

ACCEPTANCE: scrolling from the dark hero into a light section shows the light
background sweeping upward over the dark one, tied to scroll position, reversing
cleanly when you scroll back up.
```

## Prompt 13 — Method intro

```
Create components/sections/MethodIntro.tsx.

Wrapped in <ThemeSection theme="light">, id="method".
- Eyebrow: [ THE METHOD ]
- Headline: short, font-display, clamp(2.5rem, 8vw, 7rem), with SplitText by char.
- A paragraph, max-w-3xl, centered.
- Below it, the five phase names in a row, separated by middots, in small uppercase
  letter-spaced type. As the section scrolls, each name illuminates to accent in
  sequence (scrubbed ScrollTrigger, not a timed loop).

This section exists to give the reader a beat of stillness before the horizontal
section hijacks their scroll. Give it real vertical padding — py-40 minimum.

ACCEPTANCE: headline reveals on entry, phase names light up progressively as you
scroll through, and the light background is fully settled before the next section.
```

## Prompt 14 — ★ Pinned horizontal method section

```
This is the centerpiece. Take your time and get the math right.

Create components/sections/MethodHorizontal.tsx.

STRUCTURE
  <section ref={sectionRef} class="relative h-[500vh]">        ← scroll runway
    <div ref={pinRef} class="sticky top-0 h-screen overflow-hidden">
      <div ref={trackRef} class="flex h-full w-[500vw]">        ← 5 panels
        {phases.map(panel)}
      </div>
    </div>
  </section>

Each panel: w-screen h-screen, flex, items-center, px-[8vw], relative.
Inside a panel:
  - A gigantic ghost numeral ("01") absolutely positioned, font-display,
    font-size ~45vw, color ink at 4% opacity, centered-ish, pointer-events-none,
    sitting behind the content at -z-10.
  - Left/center content column, max-w-2xl:
      · phase title — font-display, clamp(3rem, 9vw, 8rem), with the accent period
      · the claim — one line, ~1.5rem, medium weight
      · a thin rule
      · three bullet points, each prefixed with an em-dash, lowercase, muted

ANIMATION
1. Horizontal drive: gsap.to(trackRef, { xPercent: -80, ease: "none",
   scrollTrigger: { trigger: sectionRef, start: "top top", end: "bottom bottom",
   scrub: 1, pin: pinRef, anticipatePin: 1, invalidateOnRefresh: true }}).
   NOTE: xPercent -80 (not -100) because the track is 5 panels wide — the correct
   value is -((panels - 1) / panels) * 100. Compute it from the array length rather
   than hardcoding, so adding a sixth phase doesn't break it.
2. Per-panel entrance: for each panel, a nested ScrollTrigger using
   containerAnimation (pass the horizontal tween) so triggers fire based on
   horizontal position:
     scrollTrigger: { trigger: panel, containerAnimation: horizontalTween,
     start: "left 70%", end: "left 20%", scrub: true }
   Animate the panel's title from x:60, opacity:0 and the bullets with a stagger.
3. Ghost numeral parallax: each numeral moves x: -20% across its panel's progress,
   again via containerAnimation, so it drifts against the text.
4. Progress tracker: a fixed row at the bottom of the pinned area — five dots
   joined by a line, with the accent fill scaling from 0→1 across the whole
   horizontal tween. Current phase label shown beside it.

GOTCHAS TO HANDLE EXPLICITLY
- Call ScrollTrigger.refresh() after fonts load (document.fonts.ready.then(...)),
  otherwise the pin distance is measured against fallback font metrics and the
  section ends early.
- Set invalidateOnRefresh: true so a window resize recomputes widths.
- On viewports below 1024px, DO NOT pin. Render the panels as a normal vertical
  stack with simple Reveal entrances instead. Use gsap.matchMedia() for this —
  it handles the teardown when crossing the breakpoint.
- Under reduced motion, also fall back to the vertical stack.
- Everything in a single gsap.context(sectionRef) with ctx.revert() on unmount.

ACCEPTANCE:
- Scrolling down moves panels sideways at a natural 1:1-ish feel, no lurching.
- Panel content animates in as each panel reaches center, not all at once on pin.
- The progress dots track position accurately.
- Resizing the window mid-section does not leave the track stranded.
- Below 1024px it's a clean vertical stack with no pinning at all.
- Scrolling back up reverses everything and releases the pin at the right spot.
```

## Prompt 15 — Services grid

```
Create components/sections/ServicesGrid.tsx. <ThemeSection theme="dark">.

- Eyebrow [ WHAT WE DO ] and a short headline.
- Four column groups from content/services.ts, responsive:
  1 col mobile → 2 col md → 4 col xl.
- Each group: a small uppercase group title with a top border, then its services
  as a vertical list.
- Each service row: name on the left, a small ↗ on the right, a hairline border
  below. Badges render beside the name — "✦" for ai, a tiny pill for popular.
- Hover on a row: the row's background fills from the left with white/5 (scaleX
  from a transform-origin-left pseudo element), the name shifts right 8px, and the
  arrow rotates 45deg. All CSS transitions, ~0.4s ease-out. No JS per row —
  there will be ~17 of these and per-row GSAP instances are wasteful.
- The whole grid enters with a Reveal stagger: groups cascade in 0.08s apart.

ACCEPTANCE: hovering a service feels immediate and crisp; the grid reflows sensibly
at every breakpoint; no layout shift on hover.
```

## Prompt 16 — Text ticker band

```
Create components/sections/TextTicker.tsx.

A full-bleed band, py-8, with top and bottom hairline borders, containing a Marquee
of a single declarative sentence repeated with a separator glyph between repetitions.

- Type is large-ish (clamp(1.5rem, 4vw, 3rem)), font-display, uppercase.
- Alternate repetitions between filled text and outlined text (use
  -webkit-text-stroke: 1px currentColor with color: transparent) for rhythm.
- The separator glyph is an accent-colored ✦ or ●.
- Direction reverses on a second stacked row for a woven effect (optional — try one
  row first, add the second only if it reads well).

Write my own sentence for this — something about outcomes over output. Do not copy
phrasing from any existing site.

ACCEPTANCE: seamless loop, readable at all sizes, and it does not cause horizontal
page overflow.
```

## Prompt 17 — Testimonials and industries

```
Two sections.

components/sections/Testimonials.tsx — <ThemeSection theme="light">
- Eyebrow [ WHAT CLIENTS SAY ], headline.
- A horizontal snap-scroll row of quote cards (overflow-x-auto, snap-x snap-mandatory,
  scrollbar hidden). Each card: w-[85vw] md:w-[38rem], border, rounded-2xl, p-10.
- Card content: five accent stars, the quote at 1.25rem leading-relaxed, then a rule,
  then author / role / company in small muted mono.
- Drag-to-scroll on desktop (pointer events, translate the container) plus native
  wheel/trackpad horizontal scroll. Keep it simple — do not pin this one, one pinned
  section per page is already a lot.
- Arrow buttons that scroll by one card width.

components/sections/Industries.tsx — dark
- Eyebrow [ WHERE WE WORK ], then a flex-wrap of ~11 industry tags as rounded-full
  outlined pills.
- On hover a pill inverts to accent background with ink text.
- Enter with a stagger of 0.03s in document order.

ACCEPTANCE: testimonial cards snap cleanly, arrows disable at the ends, industry
pills wrap without orphans at common widths.
```

## Prompt 18 — CTA and footer

```
components/sections/CTA.tsx
- Full-height dark section, dot-grid, centered.
- Enormous headline — a question, clamp(3rem, 10vw, 10rem), SplitText by char.
- Primary button plus the email address as a large MagneticLink.
- A subtle accent radial glow behind the headline (blurred div, mix-blend-screen,
  low opacity) that parallaxes slightly on scroll.

components/layout/Footer.tsx
- Four columns: services quick links, company links, tools/resources, contact.
- Above them, an oversized wordmark that spans the full width (font-display,
  text-[18vw], leading-none, white at 6% opacity) as a background flourish.
- Bottom bar: copyright, legal links, socials, and a "back to top" that
  lenis.scrollTo(0).
- The footer is revealed by the page scrolling over it: give the main content
  a higher z-index and position the footer sticky at the bottom behind it.
  (position: sticky; bottom: 0 on the footer, with the preceding section having
  a solid background and z-10.)

ACCEPTANCE: the footer emerges from underneath the CTA section as you reach the
bottom; back-to-top glides rather than jumping.
```

## Prompt 19 — Assemble the homepage

```
Write app/page.tsx composing the sections in this order:

  Hero
  LogoMarquee + StatsBar
  MethodIntro         (light)
  MethodHorizontal    (light, pinned)
  ServicesGrid        (dark)
  TextTicker
  Testimonials        (light)
  Industries          (dark)
  CTA                 (dark)

Then audit the whole page for three things and fix what you find:
1. Theme continuity — no section should start on a background that clashes with the
   one wiping in over it. Check every boundary.
2. ScrollTrigger conflicts — the pinned section must not have a theme wipe running
   across its own pin range. If it does, move the wipe to the section before it.
3. Spacing rhythm — consistent section padding, no double-gaps where a wipe already
   creates visual separation.

Add ScrollTrigger.refresh() on route change and after document.fonts.ready.

ACCEPTANCE: one full scroll from top to bottom with no jumps, no stranded pins,
no flash of wrong background, and a steady 60fps in the Performance panel.
```

---

# PHASE 5 — Inner pages

## Prompt 20 — Services page

```
Create app/services/page.tsx.

- A compact page hero: eyebrow, headline, one paragraph. Half viewport height, not full.
- The four service groups rendered as full-width expandable rows (an accordion):
  clicking a group expands its services with a height + opacity animation.
  Animate height with GSAP to "auto" — do not use CSS max-height hacks.
- Only one group open at a time; the first is open by default.
- A process strip reusing the five phases in compact vertical form.
- CTA section reused from the homepage.

Shared layout: extract the compact page hero into components/layout/PageHero.tsx
with props { eyebrow, title, description } since all four inner pages need it.

ACCEPTANCE: accordion animates smoothly with no jump at the end of the expansion,
and ScrollTrigger.refresh() fires after each toggle so downstream triggers stay accurate.
```

## Prompt 21 — Case studies index and detail

```
app/case-studies/page.tsx
- PageHero, then a filter row (All + each industry) as pill buttons.
- A grid of study cards, 1/2/3 columns responsive.
- Card: cover image in a 4:3 container with overflow-hidden; the image scales to
  1.06 on hover over 0.6s. Client name, industry + year in small mono, headline,
  and the top metric.
- Filtering animates: outgoing cards fade/scale down, the grid reflows, incoming
  cards stagger in. Use GSAP's Flip plugin if you want it seamless, or a simple
  fade-out → re-render → fade-in if not. State in React, animation in a
  useIsomorphicLayoutEffect keyed on the filter.

app/case-studies/[slug]/page.tsx
- generateStaticParams from content/case-studies.ts; notFound() for unknown slugs.
- Layout: full-bleed cover with a parallax on scroll → sticky left meta column
  (client, industry, year, services) beside a scrolling right content column →
  a metrics band with count-up numbers → next case study link at the bottom.
- generateMetadata per study for OG tags.

ACCEPTANCE: filters animate without layout thrash, every slug builds statically,
and the sticky meta column releases correctly at the end of the content column.
```

## Prompt 22 — About and Contact

```
app/about/page.tsx
- PageHero.
- A long-form manifesto section: large paragraphs where the current sentence is
  full-opacity and the rest is dimmed, advancing on scroll (scrubbed ScrollTrigger
  over the paragraph's word spans). Keep this restrained — it's easy to overdo.
- A team grid: portraits in grayscale that colorize on hover, name + role beneath.
  Use placeholder silhouettes in public/team/.
- A timeline of company milestones — a vertical rule with an accent dot that tracks
  scroll position down it.

app/contact/page.tsx
- PageHero.
- Two columns: a form on the left, direct contact details on the right.
- Form fields: name, email, company, budget range (select), message. Styled as
  underline-only inputs, no boxes — label floats up on focus, underline fills with
  accent from the left.
- Client-side validation with clear inline errors. On submit, POST to a route handler
  at app/api/contact/route.ts that validates with zod and, for now, just logs and
  returns 200 — leave a clearly marked TODO for wiring a real email provider.
- Success state replaces the form with a confirmation, animated in.

ACCEPTANCE: form is fully keyboard operable, errors are announced via aria-live,
and the submit button shows a pending state.
```

---

# PHASE 6 — Polish

## Prompt 23 — Accessibility and reduced motion audit

```
Go through the entire project and enforce these, fixing every violation you find:

1. prefers-reduced-motion: every GSAP context checks it. Scroll-scrubbed animations
   become static end-states. Lenis is disabled. Marquees stop. The preloader skips.
   Test by toggling the emulation in Chrome DevTools > Rendering.
2. All SplitText output has aria-label on the parent and aria-hidden on the spans.
3. Focus is visible everywhere — a 2px accent outline with 2px offset, never removed.
4. Color contrast: check every muted text color against its background at the actual
   rendered opacity. Anything below 4.5:1 for body text gets lightened.
5. All interactive elements are real buttons or links. No onClick on a div.
6. Pinned sections do not trap keyboard users — tabbing to an element inside a
   horizontally-scrolled panel should scroll it into view. Add a focus handler that
   calls lenis.scrollTo on the panel's corresponding scroll position.
7. Images have meaningful alt text; decorative ones have alt="".
8. Heading hierarchy is sequential on every page — exactly one h1.

Report anything you cannot fix rather than silently skipping it.
```

## Prompt 24 — Performance pass and deploy prep

```
Optimize and prepare for deployment.

PERFORMANCE
1. Audit for animation on non-composited properties. Anything animating width,
   height, top or left in a scrubbed tween moves to transform. Add will-change
   only to elements in active scrubbed animations, and remove it on completion.
2. All section components below the fold: dynamic import with next/dynamic,
   ssr: true, so their GSAP code is not in the initial bundle.
3. Images: next/image everywhere, with sizes set, priority only on the hero/cover.
4. Fonts: subset to latin, display: swap, preload the display font only.
5. Check the bundle with @next/bundle-analyzer. GSAP should appear once, not per chunk.
6. Run Lighthouse. Target: Performance 90+, Accessibility 100, Best Practices 100.
   The pinned section will cost some CLS — set explicit heights to control it.

DEPLOY PREP
7. app/layout.tsx metadata: title template, description, openGraph, twitter card,
   metadataBase.
8. app/opengraph-image.tsx generating an OG image with next/og.
9. app/sitemap.ts and app/robots.ts.
10. JSON-LD Organization + WebSite schema in the root layout.
11. A README with: setup, where to swap placeholder copy (content/ directory),
    how the scroll system works, and the known gotchas (ScrollTrigger.refresh
    after font load, the matchMedia breakpoint for the horizontal section).

ACCEPTANCE: `npm run build` succeeds with no warnings, Lighthouse targets met,
and the README is good enough that someone else could take over the project.
```

---

## Debugging reference

Problems you will hit, and what causes them:

| Symptom | Cause | Fix |
|---|---|---|
| Pinned section ends too early or late | Layout measured before webfonts loaded | `document.fonts.ready.then(() => ScrollTrigger.refresh())` |
| Scroll feels like it fights itself | Lenis running its own RAF alongside GSAP's ticker | Drive Lenis from `gsap.ticker` only |
| Animations replay or double up in dev | React 18 StrictMode double-mount | `gsap.context()` + `ctx.revert()` in cleanup |
| Horizontal track stops short of the last panel | `xPercent: -100` instead of `-((n-1)/n)*100` | Compute from panel count |
| Content jumps when a pin starts | No `anticipatePin` | `anticipatePin: 1` |
| Triggers inside horizontal section never fire | Missing `containerAnimation` | Pass the horizontal tween to each nested trigger |
| Everything breaks on resize | Cached measurements | `invalidateOnRefresh: true` + `gsap.matchMedia()` |
| Page scrolls to top on route change | Lenis not reset | Call `lenis.scrollTo(0, { immediate: true })` on pathname change |

---

## Suggested commit checkpoints

```
feat: scaffold + design tokens          (after prompt 2)
feat: smooth scroll + content layer     (after prompt 4)
feat: preloader + nav + scroll progress (after prompt 7)
feat: animation primitives              (after prompt 9)
feat: hero + marquee + stats            (after prompt 11)
feat: theme wipes + method intro        (after prompt 13)
feat: pinned horizontal method section  (after prompt 14)   ← tag this one
feat: remaining homepage sections       (after prompt 19)
feat: inner pages                       (after prompt 22)
chore: a11y + performance pass          (after prompt 24)
```

Tag the commit after Prompt 14. If a later change breaks the pinned section, that
tag is the fastest way back to a known-good scroll system.

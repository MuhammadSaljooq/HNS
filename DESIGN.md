# Design

## Visual theme
Lime in daylight. A white canvas with near-black ink. The acid lime is the brand colour and is always used as a FILL: drenched sections, buttons, the hero highlighter, the loading screen. It is never used as text or thin lines on white (1.2:1). Section rhythm: white hero → lime "How it works" (the pinned horizontal scroll) → white and grey → lime CTA → ink footer.

## Color
Tokens live in `app/globals.css` (`@theme`). Use the token classes, never raw hex values, in components.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `canvas` | `#fcfdfa` | Page base, `theme="dark"` sections | — |
| `surface` | `#f1f3ec` | `theme="light"` sections, menus, cards | — |
| `ink` | `#0b0b0c` | Text | 19.3:1 on canvas |
| `ink-soft` | `#141416` | Footer, stats pill | — |
| `ink-muted` | `#55574f` | Secondary text | 7.2:1 on canvas |
| `paper` | `#ededea` | Text on ink | — |
| `lime` | `#c8f751` | Drenched sections (`theme="lime"`), never remapped | ink on lime 15.8:1 |
| `accent` | lime | Fills: buttons, badges | — |
| `accent-ink` | `#4a6b00` | Accent as text, lines or dots on light | 6.1:1 on canvas |
| `on-accent` | ink | Text on accent fills | 15.8:1 |

Scoped remaps (in `globals.css`):
- `[data-theme="lime"]`: accent and accent-ink become ink, and on-accent becomes lime, so buttons in lime sections are ink pills with lime text.
- `[data-theme="ink"]`: accent and accent-ink become lime, so lime is readable as text on dark.

Rule of thumb: `bg-accent` for fills, `text-accent-ink` / `border-accent-ink` / `bg-accent-ink` for text, lines and dots.

## Typography
- Body: JetBrains Mono (`font-mono`).
- Display: Geist Mono (`font-display`), tracking ≥ -0.04em.
- `text-wrap: balance` on h1–h3; `text-wrap: pretty` on prose.

## Logo
- `public/brand/nhs-logo.webp|png`: full lockup, light backgrounds only (its "SOLUTIONS" lettering is navy). Used in the nav.
- `public/brand/nhs-mark.webp`: NH circle mark. Used in the footer (on ink) and for the favicon (`app/icon.png`) and Apple icon (`app/apple-icon.png`).
- The source is a raster export from Canva. Replace with a true vector SVG when the designer supplies one.

## Motion
- Hero: a lime highlighter sweeps behind "follow-up" (GSAP scaleX, expo.out, at 0.75s into the entrance timeline).
- Loading screen is drenched lime.
- Everything else is unchanged from the original build: Lenis plus GSAP ScrollTrigger, the pinned horizontal method section, the curved clip-path section wipes, SplitText reveals and the magnetic links. All of it respects reduced motion.

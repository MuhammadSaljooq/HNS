# Design

## Visual theme
Daylight metal. A cool white canvas with near-black ink. The bold sections ("How it works", the pinned horizontal scroll, the CTA, the loading screen and the footer) are solid ink. Accents are metallic: steel on white, silver on ink, used only for small details such as the hero underline, eyebrow dots, progress lines, the "." and "?" in headlines, and button hover fills. Primary buttons are ink pills on white and silver pills on ink. Section rhythm: white hero → ink "How it works" → white and grey → ink CTA → ink footer.

## Color
Tokens live in `app/globals.css` (`@theme`). Use the token classes, never raw hex values, in components.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `canvas` | `#fbfbfc` | Page base, `theme="dark"` sections | — |
| `surface` | `#eef0f3` | `theme="light"` sections, menus, cards | — |
| `line` | `#dde0e5` | Hairlines | — |
| `ink` | `#0c0d0f` | Text, `theme="ink"` sections, primary buttons | 19:1 on canvas |
| `ink-soft` | `#16181b` | Footer, stats pill | — |
| `ink-muted` | `#555a62` | Secondary text | 6.7:1 on canvas |
| `paper` | `#e9ebee` | Text on ink | — |
| `brand` | `#56616e` | Steel: accent text and lines on light, button hover fill | 6.1:1 on canvas; white on it 6.3:1 |
| `brand-bright` | `#c2c9d2` | Silver: accent on ink | 11.7:1 on ink |
| `accent` | ink (paper on ink) | Fills: buttons, badges, active chips | — |
| `accent-ink` | steel (silver on ink) | Accent text, lines, dots | — |
| `on-accent` | canvas (ink on ink sections) | Text on accent fills | — |

Scoped remap: `[data-theme="ink"]` inverts the roles. Accent becomes paper, accent-ink becomes silver, and `--fg` becomes paper.

Rule of thumb: `bg-accent` for fills, `text-accent-ink` / `border-accent-ink` / `bg-accent-ink` for text, lines and dots. `bg-metal` is a brushed-metal gradient for thin accent bars (hero underline, method progress); it follows the scope's accent-ink.

## Typography
- Body: JetBrains Mono (`font-mono`).
- Display: Geist Mono (`font-display`), tracking ≥ -0.04em.
- `text-wrap: balance` on h1–h3; `text-wrap: pretty` on prose.

## Logo
- `public/brand/nhs-logo.webp|png`: full lockup, light backgrounds only (its "SOLUTIONS" lettering is navy). Used in the nav.
- `public/brand/nhs-mark.webp`: NH circle mark. Used in the footer (on ink) and for the favicon (`app/icon.png`) and Apple icon (`app/apple-icon.png`).
- The source is a raster export from Canva. Replace with a true vector SVG when the designer supplies one.

## Motion
- Hero: a brushed-steel underline sweeps under "follow-up" (GSAP scaleX, expo.out, at 0.75s into the entrance timeline).
- Everything else is unchanged from the original build: preloader counter, Lenis plus GSAP ScrollTrigger, the pinned horizontal method section, the curved clip-path section wipes, SplitText reveals and the magnetic links. All of it respects reduced motion.

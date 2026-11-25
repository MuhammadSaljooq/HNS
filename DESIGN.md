# Design

## Visual theme
Bright and calm. A near-white canvas tinted toward pine, monospace type, one pine accent. Sections alternate between canvas, surface and wash using the curved scroll wipe (`ThemeSection`). The page closes with a single deep-green block (CTA and footer).

## Color
Tokens live in `app/globals.css` (`@theme`). Use the token classes (`bg-canvas`, `text-ink-muted`, `bg-accent`…), never raw hex values, in components.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `canvas` | `#f9fdfb` | Page base | — |
| `surface` | `#eef5f3` | Light sections (`theme="light"`), menus, cards | — |
| `wash` | `#e4f1ec` | Alternate sections (`theme="dark"`, kept for the wipe) | — |
| `line` | `#d8e0dd` | Hairlines | — |
| `ink` | `#101e1b` | Text | 16.8:1 on canvas |
| `ink-muted` | `#4e5b58` | Secondary text | 6.9:1 on canvas |
| `accent` | `#006b53` | Pine: buttons, links, markers | 6.3:1 on canvas |
| `on-accent` | `#ffffff` | Text on accent fills | 6.5:1 |
| `accent-soft` | `#d5f3e8` | Selection, tints | — |
| `deep` / `deep-soft` | `#072d25` / `#0b3a30` | CTA, footer | — |
| `on-deep` | `#eaf3f0` | Text on deep | 14.8:1 |
| `accent-bright` | `#7fdcb8` | Accent inside `data-theme="deep"` (auto-swapped) | — |

Inside `[data-theme="deep"]`, `--color-accent` is remapped to `accent-bright`, and `--color-on-accent` to `deep`, so accent classes keep working on the dark block.

Muted text never goes below `ink-muted`. Don't use `ink/40` or similar opacities for body copy.

## Typography
- Body: JetBrains Mono (`font-mono`).
- Display: Geist Mono (`font-display`), tracking ≥ -0.04em.
- `text-wrap: balance` on h1–h3; `text-wrap: pretty` on prose.

## Logo
- `public/brand/nhs-logo.webp|png`: full lockup, light backgrounds only (its "SOLUTIONS" lettering is navy). Used in the nav.
- `public/brand/nhs-mark.webp`: NH circle mark. Used in the footer (on deep) and for the favicon (`app/icon.png`) and Apple icon (`app/apple-icon.png`).
- The source is a raster export from Canva. Replace with a true vector SVG when the designer supplies one.

## Motion
Unchanged from the original build: Lenis plus GSAP ScrollTrigger, the pinned horizontal method section, the curved clip-path section wipes, SplitText reveals and the magnetic links. All of it respects reduced motion.

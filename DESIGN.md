# Ddev Studio Storefront — `DESIGN.md`

Single source of visual truth for `https://asetkode-store.pages.dev/` (`/` ID & `/en/` Global USD). Synced with [styles.css](./styles.css).

## 1. Direction & Principles
- **Aesthetic:** Editorial Commerce / Swiss Crisp + Stripe/Polar clarity. Subtle `24px` dot-grid hero canvas, compact single-fold Hero framing full 2-column Spotlight Showcase above the fold on desktop, disciplined solid accent CTAs, clean uniform card grid, and high-contrast dark value showcase band.
- **Hierarchy:** Sticky glass navbar (`64px`, strict 2-row `<= 104px` on mobile) -> compact dot-grid Hero with `.hero-meta-strip` spec bar -> 2-column Spotlight Showcase -> single-row/horizontal-scroll Filter Rail + uniform Product Grid -> `.dark-showcase-band` -> FAQ -> Footer.
- **Anti-slop bans:** No multi-color headline gradient text, no indigo-cyan launcher gradients, no neon rings, no `<= 4.5:1` badge text, no clipped mobile 2-col cards, no redundant stacked hero stat boxes.

## 2. Color Tokens (Light & Dark, WCAG >= 4.5:1)
| Token / Role | Light (`:root`) | Dark (`html[data-theme="dark"]`) | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-main` | `#f6f7fb` | `#070b14` | Page canvas |
| `--bg-surface` / `--bg-card` | `#ffffff` | `#0f1624` | Cards, spotlight, navbar card surfaces |
| `--bg-elevated` | `#eef1f7` | `#182235` | Hover tiles, stack chips, modal headers |
| `--border-color` / `--border-strong` | `#e2e8f0` / `#cbd5e1` | `#1e293b` / `#334155` | 1px hairlines & button strokes |
| `--text-primary` | `#0b0f19` | `#f8fafc` | Headings, active copy |
| `--text-secondary` / `--text-muted` | `#475569` / `#4b5563` | `#cbd5e1` / `#94a3b8` | Descriptions, metadata (`>= 4.5:1`) |
| `--accent` / `--accent-soft` | `#1d4ed8` / `#eff6ff` | `#2563eb` / `rgba(37,99,235,.16)` | Primary Cobalt Blue & active pills (`#93c5fd` pill text in dark) |
| Price / Free MIT Emerald | `#047857` / `#065f46` | `#34d399` / `#6ee7b7` | Prices, `.is-free` stat, `.spotlight-pill.is-new`, MIT badges |
| Promo / Dark Band Ink | `#b45309 -> #9a3412` pill | `#0b0f19` band / `#cbd5e1` copy | Top announcement pill (`>= 5.02:1`), `.dark-showcase-band` |

## 3. Typography System
- **Display & UI Sans:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
- **Code & Numeric Mono:** `'JetBrains Mono', monospace` (`font-variant-numeric: tabular-nums` on prices, KPI stats, counters, cart totals)
- **Scale & Tracking:**
  - `.hero-title`: `clamp(1.9rem, 3.6vw, 2.85rem)`, weight `800`, line-height `1.18`, tracking `-0.035em`
  - `.spotlight-title`: `clamp(1.32rem, 2.25vw, 1.8rem)`, weight `800`, line-height `1.24`, tracking `-0.025em`
  - `.section-header h2`: `clamp(1.35rem, 2.8vw, 1.85rem)`, weight `800`, tracking `-0.03em`
  - `.card-title`: `0.96rem` (`0.82rem` mobile), 2-line clamp, tracking `-0.02em`
  - Body: `line-height: 1.6`, mono pills `0.68rem–0.78rem`

## 4. Layout & Spacing Scale
- **Container:** `max-width: 1260px`, horizontal padding `clamp(16px, 4vw, 28px)`
- **Spacing rhythm:** 4/8px scale (`gap: 6px/10px/12px/18px/28px/36px`), `scroll-margin-top: 86px` for anchor targets below sticky `72px` navbar
- **Breakpoints:**
  - `<= 1100px`: collapse desktop `.nav-menu` links cleanly
  - `<= 960px` / `<= 860px`: stack `.spotlight-slide`, `.steps-grid`, `.footer-grid` to `1fr`
  - `<= 640px`: 2-row navbar (`brand + actions`, full-width `16px` search); 2-column `.product-grid` with compact `Demo` + `Beli` buttons (`min-height: 36px`); bottom-sheet modals (`94dvh`)
  - `<= 540px`: compact `.hero .co-stat` row (`min-height: 54px`)

## 5. Component Anatomy
- **Buttons (`.btn`, `.btn-outline`, `.icon-btn`, `.btn-card`):** Radii `--radius-sm` (`10px`) or pill (`999px`); desktop `.btn` padding `11px 20px`; `.icon-btn` `38px` (`40px` mobile); icon buttons require `aria-label`.
- **Product Cards (`.product-card`):** `14px` radius, `1px` `--border-color`, `16/9` thumbnail (`width="640" height="360"`, lazy/async), `.title-link-btn` inside `<h3>` for keyboard activation, 2-row footer with `.price-current` + 3 desktop / 2 mobile CTAs.
- **Spotlight Showcase:** `22px` radius (`--radius-xl`), `0.94fr / 1.06fr` split, `<button class="spotlight-media">` (`16/10`, `640x400`, `fetchpriority="high"`) with `${cat}` included in `aria-label` (WCAG 2.5.3), `24px x 24px` `.s-dot` `role="tab"` with Left/Right arrow keyboard nav.
- **Showcase Bento & /free/ Portal:** Reusable `.bento-kicker` / `.bento-title` / `.bento-copy` & `.custom-*` typography utilities; `/free/` MIT cards use `#065f46` pills (`>= 7:1`), `.btn-outline` secondary actions, `aria-hidden="true"` icons, and explicit empty-search fallback.
- **Dialogs, FAQ & Forms:** Every modal uses `role="dialog" aria-modal="true" aria-labelledby`, focuses close control on open, closes on `Escape`/backdrop click, and restores focus to trigger; FAQ triggers sync `aria-expanded`; all inputs have `<label for>` or `aria-label` + semantic `autocomplete`/`inputmode`.

## 6. Motion & Verification Guardrails
- **Transitions:** Subtle `0.16s–0.22s ease` hover lifts (`translateY(-1px to -4px)`); full `@media (prefers-reduced-motion: reduce)` disable rule.
- **Keyboard Focus:** Global `:focus-visible` `2px solid var(--accent)` with `2px` offset.
- **Ship Gate:** `node --check app.js` pass, zero horizontal overflow (`375px` & `1440px`), Lighthouse `100` Accessibility / `100` Best Practices / `100` SEO (`0` contrast or ARIA failures) on `/` and `/en/`.

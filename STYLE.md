# Vitrea style rules

What makes a component look and feel like Pujarr. Every `src/lib/components/ui/*` component follows these.

## Surfaces
- **Interactive controls are glass** (`app.css`, `.glass-*`):
  - `glass-fill`: the primary / selected / "on" state (filled checkbox, active switch track, selected day).
  - `glass-neutral`: neutral controls (input-like triggers, outline buttons, toggles).
  - `glass-ghost`: quiet controls; glass appears on hover/press/focus (needs `use:press`).
  - `glass-panel`: floating sheets (popover, menus, select, tooltip, hover card, command, dialog). No hover change.
- **Static containers** (card, alert, table, accordion…) are NOT glass: `bg-panel` + `border` + `rounded-xl`. Glass is for things you touch or that float.
- Use theme tokens only: `primary`, `panel`, `card`, `muted`, `border`, and the semantic `success` / `warning` / `danger`. No raw Tailwind palette colours.
- Tinted glass: set `--tone` (e.g. `glass-fill [--tone:var(--danger)]`); mix colours `in oklab` (oklch drifts to pink).

## Motion
- **Press/hover**: `use:press` (`$lib/press`) on clickable glass. Elements with it must use `transition-colors`, never `transition`/`transition-all` (they include `scale`).
- **Floating content enters with the spring**: bits-ui `forceMount` + `child` snippet, `in:fadeScale={floatingIn}` / `out:fade={{ duration: FLOATING_OUT }}`, `origin-(--bits-floating-transform-origin)` (`$lib/transitions`). Reference: `popover/popover-content.svelte`. Modals use `modalIn` (see `dialog/dialog-content.svelte`).
- **Selection moves, it doesn't jump**: one indicator slides to the active item with `use:indicator` (`$lib/indicator`). Reference: `tabs/tabs-list.svelte` + `tabs-trigger.svelte`.
- **Lists highlight with one sliding piece of glass** (select, menus and sub-menus), like Pujarr's place search: `use:indicator={{ active: "[data-highlighted]", attributes: ["data-highlighted"], curve: "smooth" }}` on the scrolling sheet. `smooth` = 300 ms that brakes without bouncing. Rows must be `relative` and paint no highlight background of their own. Sub-menus go in a Portal (inside the parent sheet its overflow clips them).
- **State changes spring**: checks, thumbs and knobs use `springSmall`/`springXSmall` (`$lib/springs`) via Svelte `Tween`, `transition:` or CSS `linear()` — not the default ease.
- Everything still works with `prefers-reduced-motion` (app.css already zeroes CSS durations; JS tweens check the media query).
- Backdrops blur, they don't darken (`backdrop-blur-[10px]`, `animate-backdrop-in`).

## Type
- Inter for UI; `font-display` with `[font-stretch:112%]` for titles (card title, dialog title, empty title).
- Small labels in small caps: `text-2xs font-semibold tracking-wider uppercase text-muted-foreground`.
- Numbers that change: `tabular-nums`.

## Detail
- Focus: the global 2px `--ring` outline (`:focus-visible`); don't stack a second ring.
- Radii: controls `rounded-md`/`rounded-lg`, floating sheets `rounded-xl`, containers `rounded-xl`.
- Icons: lucide, `size-4` in controls.
- Keep component APIs (props, exports) unchanged so the examples keep working.

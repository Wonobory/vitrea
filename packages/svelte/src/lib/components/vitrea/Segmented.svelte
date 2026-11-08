<script lang="ts" generics="T extends string">
  /**
   * Single-choice segmented control with a sliding indicator: the active
   * background is one rectangle that moves, not each button's own.
   *
   * Options sit in equal columns, so the indicator is `1/n` wide and moves
   * `i × 100 %` of itself: nothing to measure in the DOM. The version that
   * measured `offsetLeft` drifted out of place when the width changed (a panel
   * opening, a font loading) without the selection changing.
   *
   * With `glass`, the indicator is a glass lens like Aave's selector (see
   * `Lens`): it bends a copy of the options with the chosen one in the
   * action colour, travels with `springSmall` and grows a little as it moves.
   * There the width is measured, because the filter works in px.
   *
   * `onSelect` rather than `bind:`: the Map/List switch navigates, and the
   * indicator mustn't move until `value` really changes.
   */
  import { onMount, untrack, type Snippet } from "svelte";
  import { Tween } from "svelte/motion";
  import { MediaQuery } from "svelte/reactivity";
  import { springSmall } from "$lib/springs";
  import { stretchSpring, GLASS_SELECTOR } from "$lib/glass";
  import Lens from "$lib/components/vitrea/Lens.svelte";

  let {
    options,
    value,
    onSelect,
    label,
    controls,
    compact = false,
    subtle = false,
    glass = false,
    role = "tab",
    columns,
    content,
    background = "var(--card)",
    borderless = false,
    class: className = "",
  }: {
    /** Value, text and, if the text isn't enough for a screen reader, its `aria-label`. */
    options: readonly (readonly [T, string, string?])[];
    value: T;
    onSelect: (v: T) => void;
    /** The group's `aria-label`. */
    label: string;
    /** `id` of the panel it controls, if any (tabs pattern). */
    controls?: string;
    /** Less padding and smaller type: for four options in a narrow column. */
    compact?: boolean;
    /** Neutral indicator instead of the action colour: for secondary controls. */
    subtle?: boolean;
    /** Glass indicator. */
    glass?: boolean;
    /** No border of its own: floating over a map that already has one, it would be a card inside a card. */
    borderless?: boolean;
    /** Tabs (with `controls`) or radio: a filter doesn't switch panels. */
    role?: "tab" | "radio";
    /** As a grid, how many per row (otherwise all in one). The indicator moves in both directions. */
    columns?: number;
    /**
     * What goes inside each option, if it's more than the text (e.g. with a
     * count). Inherits the colour. Receives whether it's selected and whether
     * it's painted inside the glass (the copy the lens bends) or beneath.
     */
    content?: Snippet<[T, string, boolean, boolean]>;
    /** What's behind the control: the background of the copy the glass bends. */
    background?: string;
    class?: string;
  } = $props();

  const i = $derived(Math.max(0, options.findIndex(([v]) => v === value)));
  const cols = $derived(columns ?? options.length);
  const rows = $derived(Math.ceil(options.length / cols));
  const col = $derived(i % cols);
  const row = $derived(Math.floor(i / cols));
  let group = $state<HTMLDivElement>();

  // Arrows move between options, focus following selection (APG). In a grid,
  // up and down change row.
  function onKey(e: KeyboardEvent) {
    const d =
      e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : rows > 1 && e.key === "ArrowDown" ? cols : rows > 1 && e.key === "ArrowUp" ? -cols : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + options.length) % options.length;
    onSelect(options[n]![0]);
    group?.querySelectorAll<HTMLElement>(`[role="${role}"]`)[n]?.focus();
  }

  // ── The glass ─────────────────────────────────────────────────────────────
  /** The group's padding (p-1) and the indicator's radius (rounded-md). */
  const PADDING = 4;
  const RADIUS = 6;
  /**
   * Maximum displacement on each axis, as a fraction of the lens size.
   * Aave's (0.045 and 0.025 of their box) come to ~13 % of the width and ~6 %
   * of the height: it bends hard at the ends and barely at top and bottom.
   */
  const STRENGTH_X = 0.13;
  /**
   * Cap in px: with wide cells (the layers grid, ~210 px) 13 % was 27 px, and
   * the bevel (2.5 px) pulled text starting ~10 px from the edge into the rim:
   * stray streaks. Aave leaves air around the text; here there isn't any.
   */
  const MAX_DX = 6;
  const STRENGTH_Y = 0.06;
  const CHROMA = 0.1;
  const SPECULAR = 1;

  let width = $state(0);
  let height = $state(0);
  const reduced = new MediaQuery("prefers-reduced-motion: reduce");
  let mounted = $state(false);
  onMount(() => {
    mounted = true;
    return () => grow.stop();
  });

  /** The lens position, in cells (column, row): travels with `springSmall` in 350 ms (500 felt slow). */
  const TRAVEL = 350;
  const pos = new Tween(untrack(() => ({ c: col, r: row })), { duration: TRAVEL, easing: springSmall });
  $effect(() => {
    pos.set({ c: col, r: row }, { duration: reduced.current ? 0 : TRAVEL });
  });

  const itemW = $derived((width - 2 * PADDING) / cols);
  const itemH = $derived((height - 2 * PADDING) / rows);
  const cx = $derived(PADDING + itemW * (pos.current.c + 0.5));
  const cy = $derived(PADDING + itemH * (pos.current.r + 0.5));

  /** It grows a little while travelling, on a loose spring that bounces (Aave's: 66 / 4.5). */
  let stretch = $state(0);
  const grow = stretchSpring({
    stiffness: 66,
    damping: 4.5,
    position: () => [cx, cy],
    target: (vel) => Math.min(0.3, Math.sqrt(vel) * 0.134),
    paint: (v) => (stretch = v),
  });
  $effect(() => {
    void cx;
    void cy;
    if (glass && !reduced.current) untrack(() => grow.push());
  });
  const lw = $derived(itemW * (1 + 0.25 * stretch));
  const lh = $derived(itemH * (1 + 0.25 * stretch));
  const showGlass = $derived(glass && mounted && width > 0 && itemH > 0);

  const button = $derived(compact ? "px-0.5 text-2xs" : "px-3 text-xs");
</script>

<!-- Focus sits on the options with a roving tabindex, not on the container. -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
  bind:this={group}
  bind:clientWidth={width}
  bind:clientHeight={height}
  role={role === "tab" ? "tablist" : "radiogroup"}
  aria-label={label}
  onkeydown={onKey}
  class={["relative grid rounded-lg p-1", !borderless && "border border-border", !columns && "auto-cols-fr grid-flow-col", glass && "track", className]}
  style:grid-template-columns={columns ? `repeat(${columns}, minmax(0, 1fr))` : undefined}
>
  {#if !glass}
    <div
      aria-hidden="true"
      class={[
        "pointer-events-none absolute top-1 left-1 rounded-md transition-transform duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none",
        subtle ? "bg-background shadow-sm ring-1 ring-border" : "bg-primary",
      ]}
      style:width="calc((100% - 0.5rem) / {cols})"
      style:height="calc((100% - 0.5rem) / {rows})"
      style:transform="translate({col * 100}%, {row * 100}%)"
    ></div>
  {/if}
  {#each options as [v, text, aria] (v)}
    <button
      type="button"
      {role}
      aria-selected={role === "tab" ? value === v : undefined}
      aria-checked={role === "radio" ? value === v : undefined}
      aria-controls={controls}
      aria-label={aria}
      tabindex={value === v ? 0 : -1}
      onclick={() => v !== value && onSelect(v)}
      class={[
        "relative min-h-8 pointer-coarse:min-h-11 rounded-md font-semibold leading-tight text-balance transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        button,
        value === v
          ? subtle || glass
            ? "text-foreground"
            : "text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
      ]}
      >{#if content}{@render content(v, text, value === v, false)}{:else}{text}{/if}</button
    >
  {/each}
  {#if showGlass}
    <!-- The copy the glass bends: the same options, with the selected one highlighted. -->
    <Lens
      x={cx}
      y={cy}
      w={lw}
      h={lh}
      radius={RADIUS}
      shape={{ w: itemW, h: itemH, radius: RADIUS }}
      glass={GLASS_SELECTOR}
      dx={Math.min(STRENGTH_X * lw, MAX_DX)}
      dy={STRENGTH_Y * lh}
      chroma={CHROMA}
      specular={SPECULAR}
      {background}
      {width}
      {height}
    >
      <div
        class={["grid h-full p-1", !columns && "auto-cols-fr grid-flow-col"]}
        style:grid-template-columns={columns ? `repeat(${columns}, minmax(0, 1fr))` : undefined}
      >
        {#each options as [v, text] (v)}
          <span
            class={[
              "flex min-h-8 pointer-coarse:min-h-11 items-center justify-center text-center font-semibold leading-tight text-balance",
              button,
              value === v ? (subtle ? "text-foreground" : "text-primary") : "text-muted-foreground",
            ]}
            >{#if content}{@render content(v, text, value === v, true)}{:else}{text}{/if}</span
          >
        {/each}
      </div>
    </Lens>
    <!-- The glass rim and shadow. On top, no pointer events. -->
    <span
      class="rim pointer-events-none absolute rounded-md"
      style:left="{cx}px"
      style:top="{cy}px"
      style:width="{lw}px"
      style:height="{lh}px"
      aria-hidden="true"
    ></span>
  {/if}
</div>

<style>
  /* In light, the track a touch grey and the glass white (the copy the lens
     bends sits on `background`): with Aave's veil over a white card, the
     selected option barely stood out from the rest. */
  .track {
    background-image: linear-gradient(rgb(0 0 0 / 0.05), rgb(0 0 0 / 0.05));
  }
  :global(.dark) .track {
    background-image: none;
  }
  /* Aave's veil (−4 % black in light, +6 % white in dark), a thin highlight
     on top and a soft shadow: over the map, the glass has to show even with
     nothing to bend. */
  .rim {
    transform: translate(-50%, -50%);
    background: transparent;
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.7),
      inset 0 0 0 1px rgb(0 0 0 / 0.06),
      0 1px 3px rgb(0 0 0 / 0.12),
      0 4px 10px -4px rgb(0 0 0 / 0.18);
  }
  :global(.dark) .rim {
    background: rgb(255 255 255 / 0.06);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.18),
      inset 0 0 0 1px rgb(255 255 255 / 0.08),
      0 1px 3px rgb(0 0 0 / 0.4),
      0 4px 10px -4px rgb(0 0 0 / 0.5);
  }
</style>

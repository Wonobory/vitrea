<script lang="ts">
  /**
   * The bid bar: the legal bands, thresholds, the usual range, marks and the
   * thumb.
   *
   * Everything is in fractions of the bar (0–1). The thumb's centre (20 px)
   * runs from px 10 to width − 10, and everything else follows that run.
   *
   * The thumb is Aave's glass slider
   * (aave.com/design/building-glass-for-the-web), round:
   * - At rest, an opaque white button. When pressed or focused from the
   *   keyboard it grows (22 → 28 px) and turns into glass, with `springSmall`.
   * - The glass is a second copy of the bar (bands, range and marks),
   *   thicker and clipped to the lens, warped with `feDisplacementMap`
   *   (map in `$lib/glass`): flat inside, bent at the bevel, with chromatic
   *   aberration and a specular highlight. It isn't `backdrop-filter` (with
   *   SVG it only works in Chromium): the copy itself is warped.
   * - Moving fast makes it grow, with its own spring.
   */
  import { onMount, untrack } from "svelte";
  import { Tween } from "svelte/motion";
  import { MediaQuery } from "svelte/reactivity";
  import { springSmall } from "$lib/springs";
  import { stretchSpring, GLASS } from "$lib/glass";
  import Lens from "$lib/components/pujarr/Lens.svelte";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import type { BidCurve } from "$lib/bid-curve";

  /**
   * Least to most certain: not accepted, up to others, the debtor can top
   * it, approved. `accepted` = covers the listing's minimum bid in an auction
   * whose rules we don't model: it's accepted, but approval is unknown.
   * Coloured by the `--band-*` tokens in app.css.
   */
  type Band = "reject" | "decision" | "improve" | "approve" | "accepted";

  type Props = {
    /** Left to right. `to: null` = to the end. */
    zones: readonly (readonly [from: number, to: number | null, band: Band])[];
    thresholds?: readonly { at: number; text: string }[];
    range?: { from: number; to: number; title?: string } | null;
    marks?: readonly number[];
    /** Without `value`, just the bar, no thumb. */
    value?: number;
    max?: number;
    step?: number;
    oninput?: (v: number) => void;
    label?: string;
    valuetext?: string;
    /** The value, already formatted (`\n` allowed): shown under the lens while dragging, so you don't have to look elsewhere. Above, it covered the curve. */
    bubble?: string;
    /**
     * Where bids land (`$lib/bid-curve`): the curve and the threshold peaks.
     * Above the bar, like YouTube's "most replayed"; what's left of the
     * thumb, in colour.
     */
    curve?: BidCurve | null;
  };
  let {
    zones,
    thresholds = [],
    range = null,
    marks = [],
    value,
    max = 100,
    step = 1,
    oninput,
    label,
    valuetext,
    bubble,
    curve = null,
  }: Props = $props();
  const uid = $props.id();
  const path = $derived(
    curve && curve.heights.length > 1
      ? `M0,1 ${curve.heights.map((h, i) => `L${i / (curve.heights.length - 1)},${1 - h}`).join(" ")} L1,1 Z`
      : null,
  );

  const x = (f: number) => `calc(10px + (100% - 20px) * ${f})`;
  const color = (b: Band | null) => (b && b !== "accepted" ? `var(--band-${b})` : undefined);

  // ── The lens ──────────────────────────────────────────────────────────────
  /** Diameter at rest and when pressed (Aave grows ×1.5; a bit less here). */
  const REST = 22;
  const ACTIVE = 28;
  /** How much thicker the bar looks inside the glass (Aave: ~×2 when pressed). */
  const THICK = 1.7;
  /** Maximum displacement, as a fraction of the diameter (half of `scale`). */
  const STRENGTH = 0.22;
  /** Per theme, like Aave: aberration, highlight intensity and veil. */
  const CHROMA = 0.65;
  const SPECULAR = 1.5;

  let width = $state(0);
  let pressed = $state(false);
  let keyboard = $state(false);
  const reduced = new MediaQuery("prefers-reduced-motion: reduce");

  /** 0 = button at rest, 1 = glass. */
  const glass = new Tween(0, { duration: 500, easing: springSmall });
  $effect(() => {
    glass.set(pressed || keyboard ? 1 : 0, { duration: reduced.current ? 0 : 500 });
  });

  const cx = $derived(10 + (width - 20) * Math.min(Math.max((value ?? 0) / max, 0), 1));

  /**
   * Stretch by velocity (Aave's `eI`): a spring (stiffness 180, damping 14)
   * chasing a target set by how fast the lens moves, and 0.175 while held.
   * Aave narrows and lengthens the lens; round it looked odd, so it grows
   * the same on both axes: 20 % per unit.
   */
  let stretch = $state(0);
  const stretchy = stretchSpring({
    stiffness: 180,
    damping: 14,
    position: () => cx,
    target: (vel) => Math.min(0.35, Math.max(Math.min(0.35, 0.012 * vel ** 0.75), pressed ? 0.175 : 0)),
    paint: (v) => (stretch = v),
  });
  $effect(() => {
    void cx;
    void pressed;
    if (!reduced.current) untrack(() => stretchy.push());
  });

  const d = $derived(REST + (ACTIVE - REST) * glass.current);
  const w = $derived(d * (1 + 0.2 * stretch));
  const h = $derived(w);
  /** The bar inside (only the bar: the range and marks would fall outside the lens): from its real thickness to `THICK` times. */
  const thickness = $derived(1 + (THICK - 1) * Math.max(glass.current, 0));
  /** With the button covering everything, the glass is pointless. */
  const showGlass = $derived(glass.current > 0.01 && width > 0);

  onMount(() => {
    const release = () => (pressed = false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      stretchy.stop();
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  });
</script>

<!-- What you see of the bar: painted twice, the normal one and the one the glass bends. -->
{#snippet layer(scale = 1)}
  <div
    class="absolute inset-x-0 top-1/2 flex h-2.5 overflow-hidden rounded-full bg-foreground/10"
    style:transform="translateY(-50%) scaleY({scale})"
  >
    {#each zones as [from, to, b] (from)}
      <div
        class={["h-full", to == null && "flex-1"]}
        style:background={color(b)}
        style:width={to == null
          ? undefined
          : from === 0
            ? `calc(10px + (100% - 20px) * ${to})`
            : `calc((100% - 20px) * ${to - from})`}
      ></div>
    {/each}
  </div>
  {#if range}
    <!-- The usual bids: a bracket around the bar, not a separate layer. -->
    <div
      class="absolute inset-y-0 rounded-md border-2 border-primary"
      style:left={x(range.from)}
      style:width="calc((100% - 20px) * {range.to - range.from})"
      title={range.title}
    ></div>
  {/if}
  {#each marks as m (m)}
    <span
      class="absolute top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-panel"
      style:left={x(m)}
    ></span>
  {/each}
{/snippet}

<div>
  {#if thresholds.length}
    <div class="relative mb-2 h-4" aria-hidden="true">
      {#each thresholds as u (u.at)}
        <!-- Two thresholds close together (50 and 70 % with a high max, on
             mobile) overlapped: each one leans towards its side instead of
             centring. By position, not by order: they arrive high to low. -->
        {@const nearBefore = thresholds.some((v) => v.at < u.at && u.at - v.at < 0.12)}
        {@const nearAfter = thresholds.some((v) => v.at > u.at && v.at - u.at < 0.12)}
        <span
          class={[
            "absolute text-2xs whitespace-nowrap text-muted-foreground tabular-nums",
            nearAfter ? "-translate-x-full pr-1" : nearBefore ? "pl-1" : "-translate-x-1/2",
          ]}
          style:left={x(u.at)}
        >
          {u.text}
        </span>
      {/each}
    </div>
  {/if}

  {#if path}
    <div class="-mb-1 px-2.5" aria-hidden="true">
    <svg class="block h-7 w-full" viewBox="0 0 1 1" preserveAspectRatio="none">
      <defs>
        <clipPath id="{uid}-done"><rect width={Math.min(Math.max((value ?? 0) / max, 0), 1)} height="1" /></clipPath>
      </defs>
      <!-- The lines darker than the fill: in the same colour they vanished inside the curve. -->
      {#each [["fill-foreground/15 stroke-foreground/45", undefined], ["fill-primary/50 stroke-primary", `url(#${uid}-done)`]] as [cls, clip] (cls)}
        <g class={cls} clip-path={clip}>
          <path d={path} stroke="none" />
          <!-- The peaks: bids right on the threshold, a line in its exact place (not through the smoothed curve). -->
          {#each curve!.peaks as p (p.at)}
            <line x1={p.at} x2={p.at} y1="1" y2={1 - p.height} stroke-width="2" vector-effect="non-scaling-stroke" />
          {/each}
        </g>
      {/each}
    </svg>
    </div>
  {/if}

  <div class="relative h-6" bind:clientWidth={width}>
    {@render layer()}
    {#if value !== undefined}
      {#if showGlass}
        <!-- The copy the glass bends, opaque (the panel's colour). -->
        <Lens
          x={cx}
          y={12}
          {w}
          {h}
          radius={w / 2}
          shape={{ w: ACTIVE, h: ACTIVE, radius: ACTIVE / 2 }}
          glass={GLASS}
          dx={STRENGTH * d}
          dy={STRENGTH * d}
          chroma={CHROMA}
          specular={SPECULAR}
          background="var(--panel)"
          {width}
          height={24}
        >
          <div class="relative h-6">{@render layer(thickness)}</div>
        </Lens>
      {/if}
      <input
        type="range"
        min="0"
        {max}
        {step}
        {value}
        oninput={(e) => oninput?.(Number(e.currentTarget.value))}
        onpointerdown={() => (pressed = true)}
        onfocus={(e) => (keyboard = e.currentTarget.matches(":focus-visible"))}
        onblur={() => (keyboard = false)}
        aria-label={label}
        aria-valuetext={valuetext}
        class="thumb peer absolute inset-0 h-6 w-full cursor-grab appearance-none bg-transparent focus-visible:outline-none active:cursor-grabbing"
      />
      <!-- The glass veil and shadow, and the opaque button covering it at rest. On top, no pointer events.
           It anchors the value: our own tooltip, open while the knob is held (`aria-valuetext`
           already reads the value, so it's only visual). It follows the lens every frame. -->
      <Tooltip.Provider>
        <Tooltip.Root open={!!bubble && (pressed || keyboard)}>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <!-- Out of the tab order: the range input is what gets focus. -->
              <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
              <span
                {...props}
                tabindex={-1}
                class="lens pointer-events-none absolute top-1/2 rounded-full peer-focus-visible:ring-4 peer-focus-visible:ring-ring/40"
                style:left="{cx}px"
                style:width="{w}px"
                style:height="{h}px"
                style:--shadow={Math.min(Math.max(glass.current, 0), 1)}
                aria-hidden="true"
              >
                <span class="button" style:opacity={1 - Math.min(Math.max(glass.current, 0), 1)}></span>
              </span>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom" updatePositionStrategy="always" class="pointer-events-none text-center whitespace-pre-line tabular-nums"
            >{bubble}</Tooltip.Content
          >
        </Tooltip.Root>
      </Tooltip.Provider>
    {/if}
  </div>
</div>

<style>
  /* The native thumb, invisible: it only provides the run (20 px) and the touch area. */
  .thumb::-webkit-slider-thumb {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    background: transparent;
  }
  .thumb::-moz-range-thumb {
    width: 1.25rem;
    height: 1.25rem;
    border: 0;
    border-radius: 9999px;
    background: transparent;
  }
  .thumb::-moz-range-track {
    background: transparent;
  }
  /* Aave's veil: −2 % black in light, +12 % white in dark. And the shadow:
     the button's at rest, the glass's (softer) when pressed. */
  .lens {
    transform: translate(-50%, -50%);
    background: rgb(0 0 0 / 0.02);
    box-shadow:
      0 1px 3px rgb(0 0 0 / calc(0.22 - 0.08 * var(--shadow))),
      0 4px 12px -2px rgb(0 0 0 / calc(0.1 + 0.08 * var(--shadow)));
  }
  :global(.dark) .lens {
    background: rgb(255 255 255 / 0.12);
  }
  /* White in both themes, like Aave's. */
  .button {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: white;
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.08);
  }
</style>

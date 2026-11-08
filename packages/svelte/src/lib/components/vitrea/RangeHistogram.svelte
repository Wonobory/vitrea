<script lang="ts">
  /**
   * A histogram that is also the control for a range (price, €/m², floor
   * area, year): it answers "where do I put the cut" before you type any
   * number. The values are whatever passes the other filters.
   *
   * Drag across it to choose the range, drag an edge to move just that edge,
   * and a click without dragging picks that bar (another click on the same
   * one releases it). The inputs below remain the keyboard path: that's why
   * the chart isn't announced as a control.
   */
  let {
    title,
    sub = false,
    values,
    min,
    max,
    onChange,
    lo,
    hi,
    log = true,
    round,
    short,
    unit = "",
    ticks,
  }: {
    title: string;
    /** Inside a section ("More ranges"): second-level title. */
    sub?: boolean;
    values: number[];
    /** The bounds set ("" = no bound). */
    min: string;
    max: string;
    /** On release, and only if something changed. */
    onChange: (min: string, max: string) => void;
    /** The axis domain; anything outside falls in the first or last bar. */
    lo: number;
    hi: number;
    /**
     * Logarithmic for things that go from a garage to a warehouse (three
     * orders of magnitude: linear piled everything into the first bar);
     * linear for the year.
     */
    log?: boolean;
    /** What gets stored when dragging: €83,172 dragged stays at €83,000. */
    round: (v: number) => number;
    /** The value without unit, short: "30k", "1,200", "1975". */
    short: (v: number) => string;
    unit?: string;
    ticks: [number, string][];
  } = $props();

  const BARS = 36;
  const t = (v: number) => (log ? Math.log10(v) : v);
  const position = (v: number) => Math.min(1, Math.max(0, (t(v) - t(lo)) / (t(hi) - t(lo))));
  const valueAt = (f: number) => (log ? 10 ** (t(lo) + f * (t(hi) - t(lo))) : lo + f * (hi - lo));

  /**
   * Draft of the range while dragging. Dragging does NOT write to the
   * filters: each write recomputed the facet counts, the list order (with
   * its FLIP measuring hidden cards), the map markers and localStorage, on
   * every pixel. Measured at 1/4 CPU: 41 frames over 50 ms in 40 moves, the
   * worst 251 ms. Here only the handles, bar colours and the readout move;
   * `onChange` fires once, on release.
   */
  let draft = $state<{ min: string; max: string } | null>(null);
  const minV = $derived(draft ? draft.min : min);
  const maxV = $derived(draft ? draft.max : max);

  // The count per bar doesn't depend on the range: it isn't redone while dragging.
  const counts = $derived.by(() => {
    const n = Array(BARS).fill(0);
    for (const v of values) n[Math.min(BARS - 1, Math.floor(position(v) * BARS))]++;
    return n;
  });
  const histogram = $derived.by(() => {
    const top = Math.max(1, ...counts);
    return counts.map((c, i) => {
      // A bar is "inside" if its centre falls in the chosen range.
      const centre = valueAt((i + 0.5) / BARS);
      const inside = (!minV || centre >= Number(minV)) && (!maxV || centre <= Number(maxV));
      return { c, height: c ? Math.max(0.06, Math.sqrt(c / top)) : 0, inside };
    });
  });

  /** Stuck to an end = no bound: dragging all the way to the edge opens the range. */
  const bound = (f: number, end: 0 | 1) =>
    (f <= 0.005 && end === 0) || (f >= 0.995 && end === 1) ? "" : String(round(valueAt(f)));
  /**
   * Where each handle goes. Without a bound, at its end: that way both always
   * exist and can be grabbed from the start, like any range slider.
   */
  const fMin = $derived(minV ? position(Number(minV)) : 0);
  const fMax = $derived(maxV ? position(Number(maxV)) : 1);

  let canvas = $state<HTMLDivElement | null>(null);
  let drag: { mode: "new" | "min" | "max" | "both"; origin: number; x0: number } | null = null;
  let hover = $state<number | null>(null);
  /** `drag` isn't reactive (it changes on every pointermove); this is, for the readout. */
  let dragging = $state(false);
  let nearEdge = $state(false);

  const fraction = (e: PointerEvent) => {
    const r = canvas!.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  };

  /**
   * Which handle is within 8 px of the pointer. If both are (a one-bar
   * range), "both": the direction of the first move decides.
   */
  function edgeNear(e: PointerEvent): "min" | "max" | "both" | null {
    const width = canvas!.getBoundingClientRect().width;
    const f = fraction(e);
    const nMin = Math.abs(f - fMin) * width < 8;
    const nMax = Math.abs(f - fMax) * width < 8;
    return nMin && nMax ? "both" : nMin ? "min" : nMax ? "max" : null;
  }

  function onDown(e: PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag = { mode: edgeNear(e) ?? "new", origin: fraction(e), x0: e.clientX };
    dragging = true;
    draft = { min: minV, max: maxV };
  }

  function onMove(e: PointerEvent) {
    const f = fraction(e);
    hover = Math.min(BARS - 1, Math.floor(f * BARS));
    if (!drag) {
      nearEdge = !!edgeNear(e);
      return;
    }
    // Up to 3 px is a click, even over an edge: with 7 px bars, any click
    // landed near one and never released the chosen bar.
    if (Math.abs(e.clientX - drag.x0) <= 3) return;
    if (drag.mode === "both") drag.mode = e.clientX < drag.x0 ? "min" : "max";
    // Neither handle passes the other: crossing them would invert the range.
    if (drag.mode === "min") draft = { min: bound(Math.min(f, fMax), 0), max: maxV };
    else if (drag.mode === "max") draft = { min: minV, max: bound(Math.max(f, fMin), 1) };
    else {
      const [a, b] = drag.origin <= f ? [drag.origin, f] : [f, drag.origin];
      draft = { min: bound(a, 0), max: bound(b, 1) };
    }
  }

  function onUp(e: PointerEvent) {
    const a = drag;
    const b = draft;
    cancel();
    if (!a) return;
    if (Math.abs(e.clientX - a.x0) > 3) {
      // The drag's only write, and only if something changed.
      if (b && (b.min !== min || b.max !== max)) onChange(b.min, b.max);
      return;
    }
    // Click: the whole bar. If it was already exactly that one, release it.
    const i = Math.min(BARS - 1, Math.floor(a.origin * BARS));
    const bMin = bound(i / BARS, 0);
    const bMax = bound((i + 1) / BARS, 1);
    if (min === bMin && max === bMax) onChange("", "");
    else onChange(bMin, bMax);
  }

  function cancel() {
    drag = null;
    dragging = false;
    draft = null;
  }

  /** Too close together, the handles merged into a blob, and so did the labels. */
  const handles = $derived(fMax - fMin > 0.06);

  const withUnit = (s: string) => (unit ? `${s} ${unit}` : s);
  /** "160k–190k €": the unit once. */
  const span = (a: number, b: number) => withUnit(`${short(a)}–${short(b)}`);
  const auctions = (n: number) => `${n.toLocaleString("en-GB")} ${n === 1 ? "auction" : "auctions"}`;

  /**
   * The header readout, in two parts: how many and the span. It's
   * right-aligned with the count FIRST, so the span stays pinned to the edge
   * while dragging and only the number grows leftwards.
   *
   * While dragging, the range wins (what's going to stay), not the bar under
   * the pointer: that's the question being answered at that moment.
   */
  const readout = $derived.by((): { n: number | null; text: string } => {
    const [a, b] = [minV, maxV];
    if (hover != null && !dragging)
      return { n: histogram[hover]?.c ?? 0, text: span(round(valueAt(hover / BARS)), round(valueAt((hover + 1) / BARS))) };
    // The hint, only on the main one: repeated on each it was noise.
    if (!a && !b) return { n: null, text: sub ? "" : "Drag to choose" };
    const n = values.filter((v) => (!a || v >= Number(a)) && (!b || v <= Number(b))).length;
    const text = a && b ? span(Number(a), Number(b)) : a ? `from ${withUnit(short(Number(a)))}` : `up to ${withUnit(short(Number(b)))}`;
    return { n, text };
  });
</script>

<!-- On one line: if the header changed height when the readout changed, it
     would shift everything below. -->
<div class="flex items-baseline justify-between gap-2 whitespace-nowrap">
  {#if sub}
    <p role="heading" aria-level="3" class="shrink-0 text-[10px] tracking-wider text-muted-foreground uppercase">{title}</p>
  {:else}
    <p role="heading" aria-level="2" class="shrink-0 text-[11px] font-semibold tracking-wider text-foreground uppercase">{title}</p>
  {/if}
  <span class="flex min-w-0 items-baseline justify-end gap-1.5 font-mono text-2xs text-muted-foreground tabular-nums">
    {#if readout.n != null}
      <span class={["truncate", dragging && "text-foreground"]}>{auctions(readout.n)}</span>
      <span class="opacity-50">·</span>
    {/if}
    <!-- Empty, a space: with no line of text the header was 2 px shorter and jumped when it appeared. -->
    <span class="shrink-0">{readout.text || " "}</span>
  </span>
</div>
<div aria-hidden="true">
  <!-- `touch-action: none` and `data-vaul-no-drag`: in the mobile drawer,
       dragging here picks the range instead of scrolling or closing the
       drawer. The end handles stick out: the pointer area widens 8 px per
       side so they can be grabbed from the edge. -->
  <div
    data-vaul-no-drag
    role="presentation"
    onpointerdown={onDown}
    onpointermove={onMove}
    onpointerup={onUp}
    onpointercancel={cancel}
    onpointerleave={() => {
      hover = null;
      nearEdge = false;
    }}
    class={["-mx-2 touch-none px-2 select-none", nearEdge ? "cursor-ew-resize" : "cursor-crosshair"]}
  >
    <div bind:this={canvas} class="relative mt-2 flex h-12 items-end gap-0.5">
      {#each histogram as b, i (i)}
        <span class={["bar", b.inside && "inside", hover === i && "hovered"]} style:height="{b.height * 100}%"></span>
      {/each}
      <!--
        The range is a glass window over the bars, with a handle on each edge
        (like trimming a video on the iPhone), and while dragging the value of
        each end below, on the axis (at rest the header already says it, and
        isn't covered this way). With no bound at all, the window spans
        everything and is dimmed: it can be grabbed, but clips nothing.
      -->
      <span class={["frame", !minV && !maxV && "loose"]} style:left="{fMin * 100}%" style:width="{(fMax - fMin) * 100}%">
        {#if handles}<span class="handle left"></span><span class="handle right"></span>{/if}
      </span>
      {#if handles}
        {#each [[fMin, minV], [fMax, maxV]] as const as [f, v], i (i)}
          {#if v}
            <!-- `translate` from 0 to −100 % by position: it never leaves the chart at the edges. -->
            <span class={["label", dragging && "visible"]} style:left="{f * 100}%" style:translate="{-f * 100}% 0">{short(Number(v))}</span>
          {/if}
        {/each}
      {:else if minV && maxV}
        <span class={["label", dragging && "visible"]} style:left="{((fMin + fMax) / 2) * 100}%" style:translate="{-((fMin + fMax) / 2) * 100}% 0"
          >{span(Number(minV), Number(maxV))}</span
        >
      {/if}
    </div>
  </div>
  <div class="relative mt-1 h-3 border-t border-border">
    {#each ticks as [v, l] (v)}
      <span class="absolute top-0.5 -translate-x-1/2 font-mono text-3xs text-muted-foreground/60" style:left="{position(v) * 100}%">{l}</span>
    {/each}
  </div>
</div>

<style>
  /* Only `background-color` animates: a gradient doesn't interpolate, and
     with `background` in the transition the bar went through transparent
     (flashing black) between the gradient and the hover colour. Gradients
     switch instantly. */
  .bar {
    flex: 1;
    border-radius: 2px 2px 0 0;
    background-color: color-mix(in oklch, var(--muted-foreground) 20%, transparent);
    /* The height changes with the other filters (not with the range: the
       count per bar doesn't depend on it), so dragging doesn't animate it. */
    transition:
      background-color 200ms,
      height 400ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  @media (prefers-reduced-motion: reduce) {
    .bar {
      transition: background-color 200ms;
    }
  }
  .bar.hovered {
    background-color: color-mix(in oklch, var(--muted-foreground) 45%, transparent);
  }
  /* Under the gradient, a colour of the same hue: leaving the range fades from it and not from transparent. */
  .bar.inside {
    background-color: color-mix(in oklch, var(--primary) 65%, transparent);
    background-image: linear-gradient(color-mix(in oklch, var(--primary) 85%, transparent), color-mix(in oklch, var(--primary) 50%, transparent));
  }
  .bar.inside.hovered {
    background-image: linear-gradient(var(--primary), color-mix(in oklch, var(--primary) 80%, transparent));
  }
  /* The `.glass-*` tokens (app.css). */
  .frame,
  .label {
    --edge: rgb(255 255 255 / 0.55);
    --veil: rgb(0 0 0 / 0.04);
    --rim:
      inset 0 1px 0 rgb(255 255 255 / 0.7), inset 0 0 0 1px rgb(0 0 0 / 0.06), 0 1px 3px rgb(0 0 0 / 0.12),
      0 4px 10px -4px rgb(0 0 0 / 0.18);
  }
  :global(.dark) :is(.frame, .label) {
    --edge: rgb(255 255 255 / 0.28);
    --veil: rgb(255 255 255 / 0.06);
    --rim:
      inset 0 1px 0 rgb(255 255 255 / 0.18), inset 0 0 0 1px rgb(255 255 255 / 0.08), 0 1px 3px rgb(0 0 0 / 0.4),
      0 4px 10px -4px rgb(0 0 0 / 0.5);
  }
  .frame {
    position: absolute;
    top: -0.375rem;
    bottom: -0.375rem;
    border-radius: 0.5rem;
    pointer-events: none;
    background: color-mix(in oklch, var(--primary) 7%, transparent);
    box-shadow:
      inset 0 0 0 1.5px color-mix(in oklch, var(--primary) 55%, transparent),
      0 4px 14px -6px color-mix(in oklch, var(--primary) 40%, transparent);
    transition:
      background 200ms,
      box-shadow 200ms;
  }
  .frame.loose {
    background: transparent;
    box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--primary) 25%, transparent);
  }
  .handle {
    position: absolute;
    top: 50%;
    width: 0.5rem;
    height: 1.75rem;
    translate: 0 -50%;
    border-radius: 999px;
    background: linear-gradient(var(--veil), var(--veil)), var(--card);
    box-shadow: var(--rim);
  }
  .handle::after {
    content: "";
    position: absolute;
    inset: 0.5rem 0.1875rem;
    border-radius: 999px;
    background: color-mix(in oklch, var(--muted-foreground) 55%, transparent);
  }
  .handle.left {
    left: -0.25rem;
  }
  .handle.right {
    right: -0.25rem;
  }
  .label {
    position: absolute;
    top: calc(100% + 0.375rem);
    z-index: 1;
    padding: 0.125rem 0.375rem;
    border-radius: 999px;
    pointer-events: none;
    font-family: var(--font-mono);
    font-size: 0.625rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    color: var(--foreground);
    background: linear-gradient(var(--veil), var(--veil)), var(--card);
    box-shadow: var(--rim);
    opacity: 0;
    transition: opacity 150ms;
  }
  .label.visible {
    opacity: 1;
  }
  /* The 1 px specular edge. */
  .handle::before,
  .label::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, var(--edge), transparent 28% 72%, var(--edge));
    mask:
      linear-gradient(#000 0 0) content-box exclude,
      linear-gradient(#000 0 0);
  }
</style>

<script lang="ts">
  /**
   * Where winning bids land, in % of the appraised value: one bar per 5 %,
   * coloured by the legal band it falls in (as in the range lens), with the
   * thresholds, the median, and a glass readout on hover.
   *
   * Hand-made SVG, like Pujarr's own charts: few elements, every one placed.
   * Bars are full-height rects scaled from the baseline with CSS, so they grow
   * with the spring curve and a small stagger, and morph when the data changes.
   */
  type Zone = readonly [from: number, color: string];

  let {
    bins,
    step = 5,
    zones = [
      [0, "var(--danger)"],
      [50, "var(--warning)"],
      [70, "var(--success)"],
    ],
    thresholds = [50, 70],
    label,
  }: {
    /** Share of auctions (any unit) in each bin, from 0 %. */
    bins: number[];
    /** Bin width, in % of value. */
    step?: number;
    zones?: readonly Zone[];
    thresholds?: number[];
    label: string;
  } = $props();

  let width = $state(560);
  const HEIGHT = 220;
  const M = { t: 44, r: 8, b: 26, l: 8 };
  const total = $derived(bins.reduce((a, b) => a + b, 0) || 1);
  const max = $derived(Math.max(...bins, 1));
  const span = $derived(bins.length * step);
  const x = (pct: number) => M.l + (pct / span) * (width - M.l - M.r);
  const plotHeight = HEIGHT - M.t - M.b;
  const barWidth = $derived(x(step) - x(0));

  const color = (pct: number) => [...zones].reverse().find(([from]) => pct >= from)?.[1] ?? "var(--muted-foreground)";

  // Median: where half of the auctions are to the left.
  const median = $derived.by(() => {
    let acc = 0;
    for (let i = 0; i < bins.length; i++) {
      if (acc + bins[i]! >= total / 2) return (i + (total / 2 - acc) / (bins[i]! || 1)) * step;
      acc += bins[i]!;
    }
    return span;
  });

  let hovered = $state<number | null>(null);
  function onMove(e: PointerEvent) {
    const r = (e.currentTarget as SVGElement).getBoundingClientRect();
    const i = Math.floor(((e.clientX - r.left - M.l) / (width - M.l - M.r)) * bins.length);
    hovered = i >= 0 && i < bins.length ? i : null;
  }

  // Grow from zero on first paint.
  let ready = $state(false);
  $effect(() => {
    requestAnimationFrame(() => (ready = true));
  });

  const pct = (v: number) => `${Math.round((v / total) * 100)}%`;
</script>

<div class="relative w-full select-none" bind:clientWidth={width}>
  <svg
    width={width}
    height={HEIGHT}
    role="img"
    aria-label="{label}. Median {Math.round(median)}% of value."
    onpointermove={onMove}
    onpointerleave={() => (hovered = null)}
    class="block overflow-visible"
  >
    <!-- Baseline and the 10 % ticks. -->
    <line x1={M.l} x2={width - M.r} y1={HEIGHT - M.b} y2={HEIGHT - M.b} class="stroke-border" />
    {#each Array.from({ length: Math.floor(span / 10) + 1 }, (_, k) => k * 10) as t (t)}
      {#if t % 20 === 0 || width > 480}
        <text x={x(t)} y={HEIGHT - 8} text-anchor="middle" class="fill-muted-foreground text-[0.625rem] tabular-nums">{t}%</text>
      {/if}
    {/each}

    {#each bins as v, i (i)}
      {@const from = i * step}
      <rect
        x={x(from) + 1}
        y={M.t}
        width={Math.max(1, barWidth - 2)}
        height={plotHeight}
        rx="2.5"
        fill={color(from)}
        class="bar"
        style:--i={i}
        style:scale="1 {ready ? v / max : 0}"
        style:opacity={hovered === i ? 1 : hovered === null ? 0.72 : 0.28}
      />
    {/each}

    <!-- Thresholds: a thin line over the bars, label on top. -->
    {#each thresholds as u (u)}
      <line x1={x(u)} x2={x(u)} y1={M.t - 6} y2={HEIGHT - M.b} class="stroke-foreground/50" stroke-width="1" />
      <text x={x(u)} y={M.t - 10} text-anchor="middle" class="fill-muted-foreground text-[0.625rem] font-semibold tabular-nums">{u}%</text>
    {/each}

    <!-- Median, dashed, sliding with the data. -->
    <g class="median" style:translate="{x(median)}px 0">
      <line y1={M.t + 6} y2={HEIGHT - M.b} stroke-dasharray="3 3" class="stroke-primary" stroke-width="1.5" />
      <circle cy={M.t + 6} r="3" class="fill-primary" />
      <text x="-6" y={M.t + 9} text-anchor="end" class="fill-primary text-[0.625rem] font-semibold">Median</text>
    </g>
  </svg>

  {#if hovered !== null}
    {@const from = hovered * step}
    <div
      class="glass-panel pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap transition-[left,top] duration-300 ease-(--spring-small)"
      style:left="{Math.min(Math.max(x(from) + barWidth / 2, 70), width - 70)}px"
      style:top="{Math.max(0, M.t + plotHeight * (1 - bins[hovered]! / max) - 40)}px"
    >
      <span class="font-semibold tabular-nums">{pct(bins[hovered]!)}</span>
      <span class="text-muted-foreground">of auctions at {from}–{from + step}%</span>
    </div>
  {/if}
</div>

<style>
  .bar {
    transform-box: fill-box;
    transform-origin: bottom;
    transition:
      scale 650ms var(--spring-small) calc(var(--i) * 12ms),
      opacity 150ms;
  }
  .median {
    transition: translate 650ms var(--spring-small);
  }
  @media (prefers-reduced-motion: reduce) {
    .bar,
    .median {
      transition: none;
    }
  }
</style>

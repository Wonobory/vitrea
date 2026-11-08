<script lang="ts">
  /**
   * Pagination as a picker: a strip of page numbers slides under a fixed glass
   * lens (`Lens`, the same refraction as the segmented control). The current
   * page is always under the lens; neighbours fade out at the edges.
   *
   * Why not the usual "1 … 4 5 6 … 12": ellipses come and go, the row changes
   * width and every click makes the buttons jump. Here the width never changes
   * and moving is one continuous slide with `springSmall`.
   *
   * Only the pages near the strip's position are rendered, so it works the
   * same with 12 pages or 12,000. A long jump (End, or a far click) starts a
   * few slots away from the target instead of scrolling through everything.
   *
   * The strip can also be dragged like a wheel (mouse or finger) and flicked:
   * it follows the pointer, and on release settles on the page nearest to
   * where its momentum would take it. The mouse wheel turns it a page at a time.
   */
  import { onMount, untrack } from "svelte";
  import { Tween } from "svelte/motion";
  import { MediaQuery } from "svelte/reactivity";
  import { springSmall } from "../../springs";
  import { stretchSpring, GLASS_SELECTOR } from "../../glass";
  import Lens from "./Lens.svelte";
  import { Button } from "../ui/button";
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

  let {
    pages,
    page = $bindable(1),
    visible = 7,
    label = "Pagination",
    onchange,
  }: {
    /** Total number of pages. */
    pages: number;
    /** Current page, from 1. */
    page?: number;
    /** Slots shown in the strip (odd keeps the lens centred on a number). */
    visible?: number;
    label?: string;
    onchange?: (page: number) => void;
  } = $props();

  const SLOT = 40;
  const HEIGHT = 40;
  const LENS = { w: 38, h: 32, radius: 9 };
  const TRAVEL = 420;
  const MAX_JUMP = 4;

  const reduced = new MediaQuery("prefers-reduced-motion: reduce");
  const width = $derived(visible * SLOT);

  // Strip position, in pages (1 = page 1 under the lens).
  // A page chosen by dragging lands from where the strip already is: no pre-jump.
  let fromDrag = false;
  const pos = new Tween(untrack(() => page), { duration: TRAVEL, easing: springSmall });
  $effect(() => {
    const target = page;
    untrack(() => {
      const from = pos.current;
      if (!fromDrag && Math.abs(target - from) > MAX_JUMP) pos.set(target - Math.sign(target - from) * MAX_JUMP, { duration: 0 });
      pos.set(target, { duration: reduced.current ? 0 : TRAVEL });
      fromDrag = false;
    });
  });

  const go = (p: number) => {
    const n = Math.min(pages, Math.max(1, p));
    if (n === page) return;
    page = n;
    onchange?.(n);
  };

  // Pages within reach of the strip right now.
  const nearby = $derived.by(() => {
    const r = Math.ceil(visible / 2) + 1;
    const a = Math.max(1, Math.floor(pos.current) - r);
    const b = Math.min(pages, Math.ceil(pos.current) + r);
    return Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
  });
  const leftOf = (p: number) => width / 2 + (p - pos.current) * SLOT - SLOT / 2;

  // The lens stretches a little while the strip moves (the segmented control's spring).
  let stretch = $state(0);
  let mounted = $state(false);
  const grow = stretchSpring({
    stiffness: 66,
    damping: 4.5,
    position: () => pos.current * SLOT,
    target: (vel) => Math.min(0.3, Math.sqrt(vel) * 0.11),
    paint: (v) => (stretch = v),
  });
  $effect(() => {
    void pos.current;
    if (!reduced.current) untrack(() => grow.push());
  });
  onMount(() => {
    mounted = true;
    return () => grow.stop();
  });
  const lw = $derived(LENS.w * (1 + 0.3 * stretch));
  const lh = $derived(LENS.h * (1 - 0.06 * stretch));

  // Dragging the strip. Below 4 px it's a click on a number; past that the
  // click that ends the drag is swallowed.
  let grab: { x: number; from: number; moved: boolean; v: number; t: number } | null = null;
  const under = $derived(Math.min(pages, Math.max(1, Math.round(pos.current))));
  function dragStart(e: PointerEvent) {
    if (e.button !== 0) return;
    grab = { x: e.clientX, from: pos.current, moved: false, v: 0, t: e.timeStamp };
  }
  function dragMove(e: PointerEvent) {
    const g = grab;
    if (!g) return;
    const dx = e.clientX - g.x;
    if (!g.moved && Math.abs(dx) < 4) return;
    g.moved = true;
    // Past either end it gives, like a rubber band.
    let p = g.from - dx / SLOT;
    if (p < 1) p = 1 - (1 - p) * 0.3;
    if (p > pages) p = pages + (p - pages) * 0.3;
    const dt = Math.max(1, e.timeStamp - g.t);
    g.v = 0.7 * ((p - pos.current) / dt) + 0.3 * g.v;
    g.t = e.timeStamp;
    pos.set(p, { duration: 0 });
  }
  function dragEnd(e: PointerEvent) {
    const g = grab;
    grab = null;
    if (!g?.moved) return;
    window.addEventListener("click", (c) => (c.stopPropagation(), c.preventDefault()), { capture: true, once: true });
    // Where the flick would carry it (300 ms of momentum), at most 8 pages away.
    const fling = e.timeStamp - g.t > 80 ? 0 : Math.max(-8, Math.min(8, g.v * 300));
    const target = Math.min(pages, Math.max(1, Math.round(pos.current + fling)));
    fromDrag = true;
    if (target === page) {
      fromDrag = false;
      pos.set(page, { duration: reduced.current ? 0 : TRAVEL });
    } else go(target);
  }

  // The mouse wheel (or a trackpad swipe) turns it a page per notch.
  let track: HTMLElement;
  onMount(() => {
    let acc = 0;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      while (Math.abs(acc) >= 40) {
        go(page + Math.sign(acc));
        acc -= Math.sign(acc) * 40;
      }
    };
    track.addEventListener("wheel", wheel, { passive: false });
    return () => track.removeEventListener("wheel", wheel);
  });

  function onKey(e: KeyboardEvent) {
    const d = { ArrowRight: 1, ArrowLeft: -1, PageDown: visible, PageUp: -visible }[e.key];
    if (e.key === "Home") go(1);
    else if (e.key === "End") go(pages);
    else if (d) go(page + d);
    else return;
    e.preventDefault();
  }
</script>

<svelte:window onpointermove={dragMove} onpointerup={dragEnd} onpointercancel={dragEnd} />

<nav aria-label={label} class="inline-flex items-center gap-2">
  <Button variant="ghost" size="icon" onclick={() => go(page - 1)} disabled={page <= 1} aria-label="Previous page">
    <ChevronLeftIcon />
  </Button>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={track}
    class="track relative cursor-grab touch-pan-y overflow-hidden rounded-xl border select-none active:cursor-grabbing"
    style:width="{width}px"
    style:height="{HEIGHT}px"
    onkeydown={onKey}
    onpointerdown={dragStart}
  >
    <div class="strip absolute inset-0">
      {#each nearby as p (p)}
        <button
          type="button"
          class="absolute top-0 flex h-full items-center justify-center text-sm font-medium tabular-nums text-muted-foreground transition-colors hover:text-foreground"
          style:left="{leftOf(p)}px"
          style:width="{SLOT}px"
          aria-current={p === page ? "page" : undefined}
          aria-label="Page {p}"
          tabindex={p === page ? 0 : -1}
          onclick={() => go(p)}>{p}</button
        >
      {/each}
    </div>

    {#if mounted}
      <Lens
        x={width / 2}
        y={HEIGHT / 2}
        w={lw}
        h={lh}
        radius={LENS.radius}
        shape={LENS}
        glass={GLASS_SELECTOR}
        dx={Math.min(0.13 * lw, 6)}
        dy={0.06 * lh}
        chroma={0.1}
        specular={1}
        background="var(--card)"
        {width}
        height={HEIGHT}
      >
        <div class="relative h-full">
          {#each nearby as p (p)}
            <span
              class={["absolute top-0 flex h-full items-center justify-center text-sm font-semibold tabular-nums", p === under ? "text-primary" : "text-muted-foreground"]}
              style:left="{leftOf(p)}px"
              style:width="{SLOT}px">{p}</span
            >
          {/each}
        </div>
      </Lens>
      <span
        class="rim pointer-events-none absolute"
        style:left="{width / 2}px"
        style:top="{HEIGHT / 2}px"
        style:width="{lw}px"
        style:height="{lh}px"
        style:border-radius="{LENS.radius}px"
        aria-hidden="true"
      ></span>
    {/if}
  </div>

  <Button variant="ghost" size="icon" onclick={() => go(page + 1)} disabled={page >= pages} aria-label="Next page">
    <ChevronRightIcon />
  </Button>

  <span class="ml-1 text-xs whitespace-nowrap text-muted-foreground tabular-nums" aria-live="polite">of {pages.toLocaleString("en-GB")}</span>
</nav>

<style>
  /* Same track as the segmented control: a touch greyer than the card in light. */
  .track {
    background: linear-gradient(rgb(0 0 0 / 0.05), rgb(0 0 0 / 0.05)), var(--card);
  }
  :global(.dark) .track {
    background: var(--card);
  }
  /* Numbers fade out towards the edges; the lens stays clear in the middle. */
  .strip {
    mask-image: linear-gradient(to right, transparent, black 30%, black 70%, transparent);
  }
  .rim {
    transform: translate(-50%, -50%);
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

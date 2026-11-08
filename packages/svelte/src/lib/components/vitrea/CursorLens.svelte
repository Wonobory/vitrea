<script lang="ts">
  /**
   * Two glass lenses drifting over a block (the same `Lens` as the range lens):
   *
   * - A big one in front, bending and slightly magnifying everything (`back`
   *   and `children`). It drifts on its own along a slow figure-of-eight; grab
   *   it with the mouse or a finger to carry it anywhere, and when you let go
   *   it picks up its path again from there. Moving, it deforms like a drop of
   *   liquid: it stretches along the motion and narrows across it (one
   *   underdamped spring per axis), so when it stops it wobbles into shape.
   * - A smaller one behind the text, bending only `back` (gradients, dots):
   *   the letters stay crisp on top of it.
   *
   * What the lenses show is a second, inert copy of the content, hidden from
   * assistive tech. With reduced motion both rest in place.
   */
  import { onMount, untrack, type Snippet } from "svelte";
  import { Spring } from "svelte/motion";
  import { MediaQuery } from "svelte/reactivity";
  import { GLASS, stretchSpring } from "$lib/glass";
  import Lens from "$lib/components/vitrea/Lens.svelte";

  let {
    children,
    back,
    w = 210,
    h = 210,
    small = 130,
    magnify = 1.18,
    background = "var(--background)",
    class: className,
  }: {
    /** The front layer (text, buttons). */
    children: Snippet;
    /** The layer behind it (backdrop). Only this is bent by the small lens. */
    back?: Snippet;
    /** Big lens size, in px. */
    w?: number;
    h?: number;
    /** Small lens diameter, in px. */
    small?: number;
    /** How much the content grows inside the big lens. */
    magnify?: number;
    /** What sits behind the content (the copies inside the lenses are opaque). */
    background?: string;
    class?: string;
  } = $props();

  let width = $state(0);
  let height = $state(0);
  let mounted = $state(false);
  let host: HTMLElement;
  const reduced = new MediaQuery("prefers-reduced-motion: reduce");

  const big = new Spring({ x: 0, y: 0 }, { stiffness: 0.08, damping: 0.55 });
  const little = new Spring({ x: 0, y: 0 }, { stiffness: 0.04, damping: 0.6 });

  // Grabbing the big lens.
  let grab = $state<{ dx: number; dy: number } | null>(null);
  let releasedAt = 0;
  function down(e: PointerEvent) {
    if (e.button !== 0) return;
    const r = host.getBoundingClientRect();
    grab = { dx: e.clientX - r.left - big.current.x, dy: e.clientY - r.top - big.current.y };
    e.preventDefault();
  }
  function move(e: PointerEvent) {
    if (!grab) return;
    const r = host.getBoundingClientRect();
    big.target = { x: e.clientX - r.left - grab.dx, y: e.clientY - r.top - grab.dy };
  }
  function up() {
    if (!grab) return;
    grab = null;
    releasedAt = performance.now();
  }

  onMount(() => {
    mounted = true;
    big.set({ x: width * 0.66, y: height * 0.4 }, { instant: true });
    little.set({ x: width * 0.3, y: height * 0.55 }, { instant: true });
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(host);
    const t0 = performance.now();
    // Each lens heads slowly for a point on its own figure-of-eight. After a
    // release the pull fades back in over 1.5 s, so the big one doesn't snap
    // away from where it was left.
    const drift = (now: number) => {
      raf = requestAnimationFrame(drift);
      if (!visible || reduced.current || !width) return;
      const t = (now - t0) / 1000;
      if (!grab) {
        const pull = 0.03 * Math.min(1, (now - releasedAt) / 1500);
        const p = { x: width * (0.5 + 0.3 * Math.sin(t * 0.3)), y: height * (0.45 + 0.14 * Math.sin(t * 0.6)) };
        const c = big.target;
        big.target = { x: c.x + (p.x - c.x) * pull, y: c.y + (p.y - c.y) * pull };
      }
      const q = { x: width * (0.5 + 0.38 * Math.sin(t * 0.21 + 2)), y: height * (0.5 + 0.25 * Math.cos(t * 0.33)) };
      const d = little.target;
      little.target = { x: d.x + (q.x - d.x) * 0.02, y: d.y + (q.y - d.y) * 0.02 };
    };
    raf = requestAnimationFrame(drift);
    return () => (cancelAnimationFrame(raf), io.disconnect());
  });

  // Squash and stretch of the big lens.
  let sx = $state(0);
  let sy = $state(0);
  const wobble = (axis: "x" | "y", paint: (v: number) => void) =>
    stretchSpring({
      stiffness: 140,
      damping: 9,
      position: () => big.current[axis],
      target: (vel) => Math.min(0.32, 0.0025 * vel ** 0.75),
      paint,
    });
  const wx = wobble("x", (v) => (sx = v));
  const wy = wobble("y", (v) => (sy = v));
  $effect(() => {
    void big.current;
    if (!reduced.current) untrack(() => (wx.push(), wy.push()));
  });
  onMount(() => () => (wx.stop(), wy.stop()));
  const lw = $derived(w * (1 + sx - 0.5 * sy));
  const lh = $derived(h * (1 + sy - 0.5 * sx));
</script>

<svelte:window onpointermove={move} onpointerup={up} onpointercancel={up} />

{#snippet copy(layers: "back" | "all", scale: number, at: { x: number; y: number })}
  <div
    class="relative"
    style="width: {width}px; height: {height}px; transform-origin: {at.x}px {at.y}px; scale: {scale}"
    inert
  >
    {@render back?.()}
    {#if layers === "all"}{@render children()}{/if}
  </div>
{/snippet}

<div bind:this={host} bind:clientWidth={width} bind:clientHeight={height} class={["relative", className]}>
  {@render back?.()}

  <!-- The small lens: behind the text, it bends only the backdrop. -->
  {#if mounted && width > 0 && back}
    <Lens
      x={little.current.x}
      y={little.current.y}
      w={small}
      h={small}
      radius={small / 2}
      shape={{ w: small, h: small, radius: small / 2 }}
      glass={GLASS}
      dx={0.3 * small}
      dy={0.3 * small}
      chroma={0.65}
      specular={1.5}
      {background}
      {width}
      {height}
    >
      {@render copy("back", 1.1, little.current)}
    </Lens>
    <span
      class="rim pointer-events-none absolute"
      style:left="{little.current.x}px"
      style:top="{little.current.y}px"
      style:width="{small}px"
      style:height="{small}px"
      aria-hidden="true"
    ></span>
  {/if}

  {@render children()}

  <!-- The big lens, in front of everything. -->
  {#if mounted && width > 0}
    <Lens
      x={big.current.x}
      y={big.current.y}
      w={lw}
      h={lh}
      radius={Math.min(lw, lh) / 2}
      shape={{ w, h, radius: h / 2 }}
      glass={GLASS}
      dx={0.32 * h}
      dy={0.32 * h}
      chroma={0.65}
      specular={1.5}
      {background}
      {width}
      {height}
    >
      {@render copy("all", magnify, big.current)}
    </Lens>
    <!-- Its rim, and the handle you grab it by. -->
    <span
      class={["rim absolute touch-none", grab ? "cursor-grabbing" : "cursor-grab"]}
      style:left="{big.current.x}px"
      style:top="{big.current.y}px"
      style:width="{lw}px"
      style:height="{lh}px"
      onpointerdown={down}
      aria-hidden="true"
    ></span>
  {/if}
</div>

<style>
  /* The glass edge and its shadow, on top of the bent copy. */
  .rim {
    transform: translate(-50%, -50%);
    border-radius: 9999px;
    background: rgb(255 255 255 / 0.04);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.8),
      inset 0 0 0 1px rgb(0 0 0 / 0.06),
      0 2px 6px rgb(0 0 0 / 0.08),
      0 18px 40px -12px rgb(0 0 0 / 0.25);
  }
  :global(.dark) .rim {
    background: rgb(255 255 255 / 0.06);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.25),
      inset 0 0 0 1px rgb(255 255 255 / 0.08),
      0 2px 6px rgb(0 0 0 / 0.4),
      0 18px 40px -12px rgb(0 0 0 / 0.7);
  }
</style>

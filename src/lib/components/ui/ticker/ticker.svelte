<script lang="ts">
  /**
   * A number that rolls when it changes: each digit that changes rolls one step,
   * the old one out and the new one in, up when the number grows and down when it
   * shrinks, with one digit's worth of spring (8 → 3 is one step, not five).
   * Only the digits that change move. Slots count from the right, so the units
   * stay put when the number gains or loses a digit (9 → 10), and the new digit's
   * slot opens (or closes) on the spring, so what's around the number slides over
   * instead of jumping. Screen readers get the whole formatted number once; the
   * moving parts are hidden from them.
   *
   * A column, not a digit that leaves and another that arrives: on a quick
   * second change (+€5,000 twice) the column carries on from wherever it is, and
   * there's always a digit in view. With an enter and a leave, the half-arrived
   * digit turned back while the next one was still outside, and for a moment the
   * slot was empty.
   *
   * Use it wherever a count, a price or a percentage changes in front of you.
   */
  import { cubicOut } from "svelte/easing";
  import { MediaQuery } from "svelte/reactivity";
  import { springXSmall } from "$lib/springs";
  import { cn } from "$lib/utils.js";

  type Props = {
    value: number;
    /** How the number is written (currency, %, units…). Defaults to grouped digits. */
    format?: (n: number) => string;
    class?: string;
  };
  let { value, format = (n) => n.toLocaleString("en-GB"), class: className }: Props = $props();

  const reduced = new MediaQuery("prefers-reduced-motion: reduce");

  // Which way it rolls: set before the DOM updates, so every column reads the new direction.
  // svelte-ignore state_referenced_locally
  let previous = value;
  let dir = 1;
  $effect.pre(() => {
    if (value !== previous) {
      dir = value > previous ? 1 : -1;
      previous = value;
    }
  });

  const text = $derived(format(value));
  const slots = $derived([...text].map((ch, i, all) => ({ ch, key: all.length - 1 - i, digit: /\d/.test(ch) })));

  /**
   * Each slot is a short column whose rows are written as needed: on a change the
   * new digit goes in the very next row (below when the number grows, above when it
   * shrinks) and the column rolls one row, whatever the digits in between. 8 → 3 is
   * one step, not five. It's moved here, not by a CSS transition, so a change
   * mid-roll heads one row further on from wherever the column is, passing the
   * digit that was arriving; there's always a digit in view. Back at rest it
   * re-centres, so there's room either way.
   */
  const ROWS = 21;
  const MID = 10;
  const ROLL = 450;
  const rows = Array.from({ length: ROWS }, (_, i) => i);

  function roll(col: HTMLElement, digit: number) {
    const cells = [...col.children] as HTMLElement[];
    let cur = MID; // where the column is, in rows
    let target = MID; // the row it's heading for
    let raf = 0;
    const paint = () => (col.style.translate = `0 ${(-cur * 100) / ROWS}%`);
    const settle = () => {
      cells[MID]!.textContent = cells[target]!.textContent;
      cur = target = MID;
      paint();
    };
    cells[MID]!.textContent = String(digit);
    paint();

    return {
      update(next: number) {
        if (cells[target]!.textContent === String(next)) return;
        let to = dir > 0 ? Math.floor(cur) + 1 + (Number.isInteger(cur) ? 0 : 1) : Math.ceil(cur) - 1 - (Number.isInteger(cur) ? 0 : 1);
        // Out of column after many quick changes one way: move what's in view back to the middle.
        if (to < 1 || to > ROWS - 2) {
          const k = Math.round(cur) - MID;
          const seen = [];
          for (let r = Math.max(0, Math.floor(cur) - 1); r <= Math.min(ROWS - 1, Math.ceil(cur) + 1); r++) seen.push([r, cells[r]!.textContent] as const);
          for (const [r, t] of seen) cells[r - k]!.textContent = t;
          cur -= k;
          to -= k;
          paint();
        }
        cells[to]!.textContent = String(next);
        target = to;
        cancelAnimationFrame(raf);
        if (reduced.current) return settle();
        // One digit's worth of spring: all the way but the last row glides (done by half-way,
        // before the spring's peak), and the last row springs (`springXSmall`).
        const from = cur;
        const distance = target - from;
        const last = Math.sign(distance) * Math.min(1, Math.abs(distance));
        const t0 = performance.now();
        const frame = (now: number) => {
          const k = Math.min(1, (now - t0) / ROLL);
          cur = from + (distance - last) * cubicOut(Math.min(1, k / 0.5)) + last * springXSmall(k);
          paint();
          if (k < 1) raf = requestAnimationFrame(frame);
          else settle();
        };
        raf = requestAnimationFrame(frame);
      },
      destroy() {
        cancelAnimationFrame(raf);
      },
    };
  }

  /**
   * A digit that appears or goes (9 → 10): its slot opens from nothing to its
   * width, or closes, so what's around the number slides over instead of jumping.
   */
  function opening(node: HTMLElement, { going }: { going: boolean }) {
    const w = node.getBoundingClientRect().width;
    const y = 0.75 * (going ? -dir : dir);
    return {
      duration: reduced.current ? 0 : going ? 220 : 420,
      easing: going ? cubicOut : springXSmall,
      css: (t: number) => `width: ${t * w}px; opacity: ${Math.min(1, t * 1.4)}; transform: translateY(${(1 - t) * y}em)`,
    };
  }
</script>

<span class={cn("inline-flex tabular-nums", className)}>
  <span class="sr-only">{text}</span>
  <span class="inline-flex" aria-hidden="true">
    {#each slots as slot (slot.key)}
      <span class="inline-grid h-[1lh] justify-items-center overflow-clip" in:opening={{ going: false }} out:opening={{ going: true }}>
        {#if slot.digit}
          <span class="flex flex-col" use:roll={Number(slot.ch)}>
            <!-- Static text: `roll` writes the digits itself. -->
            {#each rows as r (r)}<span>0</span>{/each}
          </span>
        {:else}
          <span class="whitespace-pre">{slot.ch}</span>
        {/if}
      </span>
    {/each}
  </span>
</span>

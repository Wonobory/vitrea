<script lang="ts">
  /**
   * The site's accent picker: preset swatches (a ring slides to the chosen
   * one) and a hue slider for anything in between. Everything built on the
   * accent follows: filled glass, tints, focus rings, charts.
   */
  import { onMount } from "svelte";
  import * as Popover from "$lib/components/ui/popover";
  import { Slider } from "$lib/components/ui/slider";
  import { Button } from "$lib/components/ui/button";
  import { indicator } from "$lib/indicator";
  import { ACCENTS, accent, initAccent, setAccent } from "$lib/accent.svelte";

  onMount(initAccent);

  const swatch = (h: number, c: number) => `oklch(0.6 ${0.21 * c} ${h})`;
  const same = (a: { h: number; c: number }) => a.h === accent.current.h && a.c === accent.current.c;
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" aria-label="Accent colour">
        <span class="size-4 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)]" style:background={swatch(accent.current.h, accent.current.c)}></span>
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content align="end" class="w-60 space-y-4">
    <div class="space-y-2.5">
      <h3 class="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">Accent</h3>
      <div
        class="grid grid-cols-5 gap-2.5"
        use:indicator={{ active: '[aria-pressed="true"]', className: "rounded-full ring-2 ring-foreground/70 ring-offset-2 ring-offset-card" }}
      >
        {#each ACCENTS as a (a.name)}
          <button
            type="button"
            class="relative size-8 rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_0_0_1px_rgb(0_0_0/0.12)] transition-transform hover:scale-110"
            style:background={swatch(a.h, a.c)}
            aria-pressed={same(a)}
            aria-label={a.name}
            title={a.name}
            onclick={() => setAccent(a)}
          ></button>
        {/each}
      </div>
    </div>
    <div class="space-y-2.5">
      <div class="flex items-baseline justify-between">
        <h3 class="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">Hue</h3>
        <span class="text-xs text-muted-foreground tabular-nums">{Math.round(accent.current.h)}°</span>
      </div>
      <Slider
        type="single"
        min={0}
        max={359}
        value={accent.current.h}
        onValueChange={(h) => setAccent({ name: "Custom", h, c: Math.max(accent.current.c, 0.8) })}
        aria-label="Accent hue"
      />
      <div
        class="h-1.5 rounded-full"
        style:background="linear-gradient(to right, {Array.from({ length: 13 }, (_, i) => swatch(i * 30, 0.85)).join(', ')})"
        aria-hidden="true"
      ></div>
    </div>
  </Popover.Content>
</Popover.Root>

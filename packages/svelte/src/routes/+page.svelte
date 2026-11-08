<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import { toast } from "svelte-sonner";
  import Segmented from "$lib/components/vitrea/Segmented.svelte";
  import Histogram from "$lib/components/vitrea/Histogram.svelte";
  import SliderDemo from "$docs/examples/slider.svelte";
  import Pill from "$docs/examples/pill.svelte";
  import SwitchDemo from "$docs/examples/switch.svelte";
  import ToggleDemo from "$docs/examples/toggle.svelte";
  import PageLens from "$lib/components/vitrea/PageLens.svelte";
  import CalendarDemo from "$docs/examples/calendar.svelte";
  import OtpDemo from "$docs/examples/input-otp.svelte";
  import { Switch } from "$lib/components/ui/switch";
  import BidBar from "$docs/components/BidBar.svelte";
  import { bidCurve } from "$docs/bid-curve";
  import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
  import BellIcon from "@lucide/svelte/icons/bell";
  import { GROUPS, NAME, DOCS } from "$docs/docs";

  let variant = $state<"glass" | "solid" | "ghost">("glass");
  let page = $state(4);
  let days = $state<string[]>(["mon", "tue", "wed", "fri"]);
  const DAYS = [
    ["mon", "M", "Monday"],
    ["tue", "T", "Tuesday"],
    ["wed", "W", "Wednesday"],
    ["thu", "T", "Thursday"],
    ["fri", "F", "Friday"],
    ["sat", "S", "Saturday"],
    ["sun", "S", "Sunday"],
  ];
  // Hero
  let view = $state<"map" | "list" | "grid">("map");
  let bid = $state(62);
  let alerts = $state(true);
  const zones = [
    [0, 0.5, "decision"],
    [0.5, 0.7, "improve"],
    [0.7, null, "approve"],
  ] as const;
  const curve = bidCurve(
    [[0.02, 0.2], [0.1, 0.33], [0.25, 0.5], [0.5, 0.62], [0.75, 0.74], [0.9, 0.88], [0.98, 0.97]],
    1,
    [[0.5, 0.05], [0.7, 0.06]],
  );
  const eur = (n: number) => n.toLocaleString("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  // Example shape, not real figures: winning bids pile up at 50 % and 70 %.
  const bins = [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 19, 9, 10, 9, 22, 10, 8, 6, 5, 4, 3, 2, 1, 1];
</script>

<svelte:head>
  <title>{NAME} · Liquid glass components for Svelte</title>
  <meta name="description" content="A liquid glass component system for Svelte 5, built for Pujarr." />
</svelte:head>

<!-- A vivid gradient that drifts slowly behind a pane of glass with the real controls: glass only shows
     what it does when there's colour behind it. -->
<section class="hero relative isolate overflow-hidden border-b">
  <div class="blob b1" aria-hidden="true"></div>
  <div class="blob b2" aria-hidden="true"></div>
  <div class="blob b3" aria-hidden="true"></div>
  <div class="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-28">
    <div>
      <p class="text-2xs font-semibold tracking-[0.2em] text-foreground/70 uppercase">Svelte 5 · Tailwind 4 · bits-ui</p>
      <h1 class="mt-4 font-display text-5xl font-semibold tracking-tight [font-stretch:112%] sm:text-6xl lg:text-7xl">
        Glass that actually bends light.
      </h1>
      <p class="mt-4 text-sm text-foreground/70">
        <span class="font-display text-base font-semibold text-foreground italic [font-stretch:112%]">vitrea</span>
        <span class="mx-1.5">·</span>Latin, adj. <em>“made of glass”</em>, from <em>vitrum</em>, glass.
      </p>
      <p class="mt-5 max-w-xl text-lg text-foreground/75">
        {NAME} is the component system behind <a href="https://pujarr.com" class="text-foreground underline underline-offset-4">Pujarr</a>:
        {DOCS.length} components where the glass is a real displacement map, with refraction, chromatic aberration and specular rims.
      </p>
      <div class="mt-8 flex gap-3">
        <Button size="lg" href="/components/button">Browse components <ArrowRightIcon /></Button>
        <Button size="lg" variant="outline" href="/components/slider">See the lens</Button>
      </div>
    </div>
    <div class="relative">
      <div class="slab flex flex-col gap-5 p-5">
        <div class="flex items-center justify-between gap-3">
          <Segmented
            options={[["map", "Map"], ["list", "List"], ["grid", "Grid"]]}
            value={view}
            onSelect={(v) => (view = v)}
            label="View"
            role="radio"
            glass
          />
          <Badge variant="success" dot="pulse">Live</Badge>
        </div>
        <!-- The bar's lens copies an opaque `--panel` behind it, so it sits on a solid well. -->
        <div class="rounded-xl bg-panel px-4 pt-10 pb-3">
          <BidBar
            {zones}
            thresholds={[{ at: 0.5, text: "50%" }, { at: 0.7, text: "70%" }]}
            range={{ from: 0.5, to: 0.74 }}
            {curve}
            value={bid}
            oninput={(v) => (bid = v)}
            bubble={eur(bid * 1000)}
            label="Your bid, % of value"
            valuetext="{bid}% of value"
          />
        </div>
        <div class="flex items-center justify-between gap-4 px-1">
          <div class="text-sm">
            <div class="font-medium">New auctions near you</div>
            <div class="text-xs text-muted-foreground">Lleida · flats under €120k</div>
          </div>
          <Switch bind:checked={alerts} aria-label="New auctions near you" />
        </div>
      </div>
      <!-- A second, smaller pane over the corner: glass is layers. -->
      <div class="slab absolute -bottom-12 -left-6 hidden items-center gap-3 px-4 py-3 sm:flex">
        <span class="glass-fill grid size-8 place-items-center rounded-full"><BellIcon class="size-4" /></span>
        <div class="text-sm">
          <div class="font-medium">Bidding opens tomorrow</div>
          <div class="text-xs text-muted-foreground">Flat in Balaguer, 84 m²</div>
        </div>
      </div>
    </div>
  </div>
</section>

{#snippet tile(title: string, slug: string)}
  <a href="/components/{slug}" class="eyebrow group/t flex items-center justify-between">
    {title}
    <ArrowRightIcon class="size-3.5 opacity-0 transition-opacity group-hover/t:opacity-100" />
  </a>
{/snippet}

<!-- Everything here is live: the real components, not pictures of them. -->
<section class="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-6">
  <div class="tile md:col-span-4">
    {@render tile("Slider", "slider")}
    <div class="py-6"><SliderDemo /></div>
    <p class="text-center text-xs text-muted-foreground">Drag a knob: it turns into a lens that bends the track.</p>
  </div>
  <div class="flex flex-col gap-4 md:col-span-2">
    <div class="tile">
      {@render tile("Segmented control", "segmented")}
      <Segmented
        options={[["glass", "Glass"], ["solid", "Solid"], ["ghost", "Ghost"]]}
        value={variant}
        onSelect={(v) => (variant = v)}
        label="Style"
        role="radio"
        glass
      />
    </div>
    <div class="tile">
      {@render tile("Buttons", "button")}
      <div class="flex flex-wrap gap-2">
        <Button onclick={() => toast.success("Saved to your list", { description: "We'll tell you when the bidding opens." })}>Save</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  </div>

  <div class="tile md:col-span-2 md:row-span-2">
    {@render tile("Calendar", "calendar")}
    <CalendarDemo />
  </div>
  <div class="tile md:col-span-2">
    {@render tile("Switch", "switch")}
    <SwitchDemo />
  </div>
  <div class="tile flex flex-col md:col-span-2">
    {@render tile("Toggle & badge", "toggle")}
    <div class="flex flex-1 flex-col items-center justify-center gap-5">
      <ToggleDemo />
      <div class="flex flex-wrap justify-center gap-2">
        <Badge variant="success" dot="pulse">Live</Badge>
        <Badge variant="warning" dot>Ends today</Badge>
        <Badge variant="destructive" dot>Occupied</Badge>
        <Badge variant="info">Verified</Badge>
      </div>
    </div>
  </div>
  <div class="tile md:col-span-2">
    {@render tile("Pagination", "pagination")}
    <div class="flex flex-col items-center gap-3">
      <PageLens pages={12} bind:page visible={5} />
      <p class="text-xs text-muted-foreground">Drag it, flick it, or use the wheel.</p>
    </div>
  </div>
  <div class="tile md:col-span-2">
    {@render tile("Toggle group", "toggle-group")}
    <div class="flex flex-col items-center gap-3">
      <ToggleGroup.Root type="multiple" bind:value={days} aria-label="Alert days">
        {#each DAYS as [value, short, name] (value)}
          <ToggleGroup.Item {value} aria-label={name} class="min-w-9">{short}</ToggleGroup.Item>
        {/each}
      </ToggleGroup.Root>
      <p class="text-xs text-muted-foreground">Days next to each other fuse into one piece of glass.</p>
    </div>
  </div>

  <div class="tile flex flex-col md:col-span-4">
    {@render tile("Chart", "chart")}
    <div class="flex flex-1 flex-col justify-center">
      <Histogram {bins} label="Where winning bids land, in % of value (example data)" />
      <p class="mt-2 text-center text-xs text-muted-foreground">Where winning bids land, in % of the valuation. Hover a bar. Example data.</p>
    </div>
  </div>
  <div class="flex flex-col gap-4 md:col-span-2">
    <div class="tile">
      {@render tile("Input OTP", "input-otp")}
      <OtpDemo />
    </div>
    <div class="tile">
      {@render tile("Pills", "pill")}
      <Pill />
    </div>
  </div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
  {#each GROUPS as g (g.name)}
    <h2 class="mt-12 mb-4 font-display text-xl font-semibold [font-stretch:112%]">{g.name}</h2>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {#each g.docs as d (d.slug)}
        <a href="/components/{d.slug}" class="group rounded-xl border bg-panel p-4 transition-colors hover:border-foreground/20">
          <div class="flex items-center justify-between font-medium">
            {d.name}
            <ArrowRightIcon class="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p class="mt-1 text-sm text-muted-foreground">{d.description}</p>
        </a>
      {/each}
    </div>
  {/each}
</section>

<footer class="border-t py-8 text-center text-sm text-muted-foreground">
  Built by Oriol for <a href="https://pujarr.com" class="underline underline-offset-4">Pujarr</a>. Glass technique after Aave's
  <a href="https://aave.com/design/building-glass-for-the-web" class="underline underline-offset-4">Building glass for the web</a>.
</footer>

<style>
  /* Three soft blobs that drift; the blur turns them into a mesh gradient. */
  .hero {
    background: color-mix(in oklab, var(--primary) 8%, var(--background));
  }
  .blob {
    position: absolute;
    z-index: -1;
    border-radius: 9999px;
    filter: blur(70px);
    opacity: 0.75;
    pointer-events: none;
    will-change: transform;
    animation: drift 18s ease-in-out infinite alternate;
  }
  .b1 {
    width: 34rem;
    height: 34rem;
    left: 38%;
    top: -12rem;
    background: var(--primary);
  }
  .b2 {
    width: 28rem;
    height: 28rem;
    right: -6rem;
    bottom: -10rem;
    background: var(--band-improve);
    animation-duration: 22s;
    animation-direction: alternate-reverse;
  }
  .b3 {
    width: 22rem;
    height: 22rem;
    left: 62%;
    top: 30%;
    background: var(--band-decision);
    animation-duration: 26s;
  }
  @keyframes drift {
    to {
      transform: translate(-6rem, 4rem) scale(1.15);
    }
  }
  /* The pane: see-through, blurring and saturating what's behind, with a glass rim. */
  .slab {
    border-radius: var(--radius-2xl);
    background: color-mix(in oklab, var(--card) 55%, transparent);
    backdrop-filter: blur(22px) saturate(1.7);
    -webkit-backdrop-filter: blur(22px) saturate(1.7);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.6),
      inset 0 0 0 1px rgb(255 255 255 / 0.25),
      0 20px 50px -20px rgb(0 0 0 / 0.35);
  }
  :global(.dark) .slab {
    background: color-mix(in oklab, var(--card) 45%, transparent);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.16),
      inset 0 0 0 1px rgb(255 255 255 / 0.08),
      0 20px 50px -20px rgb(0 0 0 / 0.7);
  }
  .tile {
    border: 1px solid var(--border);
    border-radius: var(--radius-2xl);
    background: var(--panel);
    padding: 1.25rem;
  }
  .eyebrow {
    margin-bottom: 1rem;
    font-size: var(--text-2xs);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted-foreground);
  }
  a.eyebrow:hover {
    color: var(--foreground);
  }
</style>

<script lang="ts">
  // Logo concepts for Vitrea. Not linked from the site: a page to compare them.
  import Wordmark from "$lib/components/vitrea/Wordmark.svelte";
  const concepts = [
    { id: "broken", name: "Broken line", idea: "A straight line that shifts where it passes behind the glass: refraction, drawn in one stroke. Reads at 16 px." },
    { id: "bead", name: "Bead", idea: "A drop of glass with its specular highlight and the caustic it throws below. The header's dot, finished." },
    { id: "prism", name: "Prism V", idea: "Two panes of glass leaning into a V; where they overlap the colour deepens, and the edges split slightly into red and blue." },
    { id: "layers", name: "Layers", idea: "Three panes of glass stacked off-centre; each overlap is a shade deeper. Glass UI is layers of glass." },
    { id: "monogram", name: "Monogram", idea: "A V cut out of a glass tile, with the chromatic fringe the components have at their edges." },
    { id: "wordmark", name: "Wordmark", idea: "Just the name, with the dot of the i as a glass bead. Works on its own or next to any of the marks." },
  ];
</script>

<svelte:head><title>Vitrea · Logo concepts</title></svelte:head>

{#snippet mark(id: string, size: number)}
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
    <defs>
      <linearGradient id="fill-{id}-{size}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="color-mix(in oklch, var(--primary) 70%, white)" />
        <stop offset="0.55" stop-color="var(--primary)" />
        <stop offset="1" stop-color="color-mix(in oklch, var(--primary) 75%, black)" />
      </linearGradient>
      <linearGradient id="pane-{id}-{size}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="color-mix(in oklch, var(--primary) 30%, transparent)" />
        <stop offset="1" stop-color="color-mix(in oklch, var(--primary) 12%, transparent)" />
      </linearGradient>
      <radialGradient id="caustic-{id}-{size}" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="color-mix(in oklch, var(--primary) 55%, white)" stop-opacity="0.9" />
        <stop offset="1" stop-color="var(--primary)" stop-opacity="0" />
      </radialGradient>
    </defs>

    {#if id === "broken"}
      <!-- The line, outside the glass -->
      <path d="M3 37 H14 M50 37 H61" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <!-- The glass -->
      <rect x="12" y="12" width="40" height="40" rx="12" fill="url(#pane-{id}-{size})" stroke="color-mix(in oklch, var(--primary) 55%, transparent)" stroke-width="1.5" />
      <!-- The same line, shifted inside it -->
      <path d="M17 28 H47" stroke="var(--primary)" stroke-width="5" stroke-linecap="round" />
      <!-- Specular edge -->
      <path d="M16 22 Q16 16 22 16 H30" stroke="white" stroke-opacity="0.9" stroke-width="2" stroke-linecap="round" fill="none" />
    {:else if id === "bead"}
      <ellipse cx="32" cy="55" rx="16" ry="4.5" fill="url(#caustic-{id}-{size})" />
      <circle cx="32" cy="29" r="21" fill="url(#fill-{id}-{size})" />
      <ellipse cx="25" cy="19" rx="9" ry="5.5" fill="white" fill-opacity="0.55" transform="rotate(-30 25 19)" />
      <path d="M45 37 A15 15 0 0 1 36 46" stroke="white" stroke-opacity="0.75" stroke-width="2.2" stroke-linecap="round" fill="none" />
    {:else if id === "prism"}
        <rect x="10" y="6" width="15" height="54" rx="7.5" transform="rotate(-22 17.5 33)" fill="color-mix(in oklch, var(--primary) 60%, transparent)" />
        <rect x="39" y="6" width="15" height="54" rx="7.5" transform="rotate(22 46.5 33)" fill="color-mix(in oklch, var(--primary) 60%, transparent)" />
      <!-- Chromatic fringe: the edges split into red and blue -->
      <rect x="9.3" y="6" width="15" height="54" rx="7.5" transform="rotate(-22 17.5 33)" fill="none" stroke="oklch(0.65 0.22 25)" stroke-opacity="0.55" stroke-width="0.8" />
      <rect x="39.7" y="6" width="15" height="54" rx="7.5" transform="rotate(22 46.5 33)" fill="none" stroke="oklch(0.62 0.2 250)" stroke-opacity="0.6" stroke-width="0.8" />
    {:else if id === "layers"}
      {#each [[6, 6, 0.28], [16, 16, 0.38], [26, 26, 0.5]] as [x, y, a] (x)}
        <rect {x} {y} width="32" height="32" rx="9" fill="color-mix(in oklch, var(--primary) {a * 100}%, transparent)" stroke="color-mix(in oklch, var(--primary) 70%, white)" stroke-opacity="0.7" stroke-width="1" />
      {/each}
      <path d="M30 32 Q30 28 34 28 H40" stroke="white" stroke-opacity="0.9" stroke-width="1.6" stroke-linecap="round" fill="none" />
    {:else if id === "monogram"}
      <rect x="6" y="6" width="52" height="52" rx="15" fill="url(#fill-{id}-{size})" />
      <path d="M8 18 Q8 8 18 8 H34" stroke="white" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <!-- The V, with a red and a blue ghost either side -->
      <path d="M19.2 19 L32 46 L44.8 19" stroke="oklch(0.7 0.2 25)" stroke-opacity="0.7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M20.8 19 L32 46 L43.2 19" stroke="oklch(0.75 0.15 220)" stroke-opacity="0.7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M20 19 L32 46 L44 19" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    {:else}
      <!-- The wordmark's bead on its own (favicon) -->
      <circle cx="32" cy="32" r="18" fill="url(#fill-{id}-{size})" />
      <ellipse cx="26" cy="24" rx="7" ry="4.5" fill="white" fill-opacity="0.55" transform="rotate(-30 26 24)" />
    {/if}
  </svg>
{/snippet}

{#snippet wordmark()}
  <Wordmark class="text-5xl" />
{/snippet}

<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
  <h1 class="font-display text-4xl font-semibold tracking-tight [font-stretch:112%]">Logo concepts</h1>
  <p class="mt-2 max-w-2xl text-muted-foreground">
    Six directions around one idea: glass that bends light. Each in light and dark, next to the name, and at favicon sizes.
    They follow the accent picker in the header.
  </p>

  <div class="mt-10 grid gap-6 lg:grid-cols-2">
    {#each concepts as c, i (c.id)}
      <article class="overflow-hidden rounded-2xl border bg-panel">
        <div class="grid grid-cols-2">
          {#each ["light", "dark"] as theme (theme)}
            <div
              class={["flex flex-col items-center justify-center", theme === "dark" && "dark"]}
              style="padding: 44px 16px; gap: 28px; min-height: 240px; {theme === 'dark' ? 'background: oklch(0.16 0.01 273); color: white' : 'background: white; color: oklch(0.15 0.01 273)'}"
            >
              {#if c.id === "wordmark"}
                {@render wordmark()}
              {:else}
                {@render mark(c.id, 96)}
                <div class="flex items-center gap-2.5">
                  {@render mark(c.id, 30)}
                  <span class="font-display text-2xl font-semibold tracking-tight [font-stretch:112%]">Vitrea</span>
                </div>
              {/if}
            </div>
          {/each}
        </div>
        <div class="flex items-start justify-between gap-4 border-t p-5">
          <div>
            <h2 class="font-medium"><span class="text-muted-foreground tabular-nums">{i + 1}.</span> {c.name}</h2>
            <p class="mt-1 text-sm text-muted-foreground">{c.idea}</p>
          </div>
          <div class="flex shrink-0 items-end gap-2 text-foreground" title="Favicon sizes: 32 and 16 px">
            {@render mark(c.id, 32)}
            {@render mark(c.id, 16)}
          </div>
        </div>
      </article>
    {/each}
  </div>
</div>

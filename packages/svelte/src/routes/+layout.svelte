<script lang="ts">
  import GlassFilters from "$lib/components/vitrea/GlassFilters.svelte";
  import "../app.css";
  import { page } from "$app/state";
  import { ModeWatcher, toggleMode } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Button } from "$lib/components/ui/button";
  import MenuIcon from "@lucide/svelte/icons/menu";
  import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import { GROUPS, NAME } from "$docs/docs";
  import AccentPicker from "$docs/components/AccentPicker.svelte";
  import Wordmark from "$docs/components/Wordmark.svelte";

  let { children } = $props();
  let menu = $state(false);
  const current = $derived(page.params.slug);
</script>

<svelte:head><title>{NAME}</title></svelte:head>

<ModeWatcher defaultMode="dark" />
<Toaster />
<GlassFilters />

{#snippet nav()}
  <nav class="flex flex-col gap-6 text-sm">
    {#each GROUPS as g (g.name)}
      <div>
        <h4 class="mb-1.5 px-2 text-2xs font-semibold tracking-wider text-muted-foreground uppercase">{g.name}</h4>
        <ul class="flex flex-col">
          {#each g.docs as d (d.slug)}
            <li>
              <a
                href="/components/{d.slug}"
                onclick={() => (menu = false)}
                aria-current={current === d.slug ? "page" : undefined}
                class="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:font-medium aria-[current=page]:text-foreground"
                >{d.name}</a
              >
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>
{/snippet}

<div class="min-h-screen bg-background">
  <header class="sticky top-0 z-40 border-b bg-background/75 backdrop-blur-xl">
    <div class="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
      <Sheet.Root bind:open={menu}>
        <Sheet.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="ghost" size="icon" class="lg:hidden" aria-label="Menu"><MenuIcon /></Button>
          {/snippet}
        </Sheet.Trigger>
        <Sheet.Content side="left" class="w-72 overflow-y-auto p-6">{@render nav()}</Sheet.Content>
      </Sheet.Root>
      <a href="/" class="flex items-center" aria-label="{NAME}, home"><Wordmark class="text-2xl" /></a>
      <a href="/components/button" class="ml-4 hidden text-sm text-muted-foreground hover:text-foreground sm:block">Components</a>
      <div class="ml-auto flex items-center gap-1">
        <AccentPicker />
        <Button variant="ghost" size="icon" onclick={toggleMode} aria-label="Toggle theme">
          <SunIcon class="hidden dark:block" /><MoonIcon class="dark:hidden" />
        </Button>
      </div>
    </div>
  </header>

  {#if page.route.id === "/"}
    {@render children()}
  {:else}
    <div class="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6">
      <aside class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-52 shrink-0 overflow-y-auto py-8 lg:block">
        {@render nav()}
      </aside>
      <main class="min-w-0 flex-1 py-8">{@render children()}</main>
    </div>
  {/if}
</div>

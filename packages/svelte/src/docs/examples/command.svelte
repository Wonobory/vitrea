<script lang="ts">
  import * as Command from "$lib/components/ui/command";
  import * as Kbd from "$lib/components/ui/kbd";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import MapIcon from "@lucide/svelte/icons/map";
  import BellIcon from "@lucide/svelte/icons/bell";
  import HeartIcon from "@lucide/svelte/icons/heart";
  import SettingsIcon from "@lucide/svelte/icons/settings";

  let search = $state("");
  let dialogSearch = $state("");
  let open = $state(false);

  const pick = (what: string) => {
    open = false;
    toast(what);
  };
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    }
  }}
/>

{#snippet items(query: string)}
  <Command.Empty>No results for “{query}”.</Command.Empty>
  <Command.Group heading="Cities">
    <Command.Item onSelect={() => pick("Barcelona")}><MapIcon /> Barcelona</Command.Item>
    <Command.Item onSelect={() => pick("Madrid")}><MapIcon /> Madrid</Command.Item>
    <Command.Item onSelect={() => pick("Valencia")}><MapIcon /> Valencia</Command.Item>
  </Command.Group>
  <Command.Separator />
  <Command.Group heading="Go to">
    <Command.Item onSelect={() => pick("Following")}><HeartIcon /> Following <Command.Shortcut>⌘F</Command.Shortcut></Command.Item>
    <Command.Item onSelect={() => pick("Alerts")}><BellIcon /> Alerts <Command.Shortcut>⌘A</Command.Shortcut></Command.Item>
    <Command.Item onSelect={() => pick("Settings")}><SettingsIcon /> Settings <Command.Shortcut>⌘,</Command.Shortcut></Command.Item>
  </Command.Group>
{/snippet}

{#snippet hints()}
  <div class="-mx-1 mt-1 -mb-1 flex items-center gap-3 border-t px-3 py-2 text-2xs text-muted-foreground">
    <span class="flex items-center gap-1"><Kbd.Root>↑</Kbd.Root><Kbd.Root>↓</Kbd.Root> move</span>
    <span class="flex items-center gap-1"><Kbd.Root>↵</Kbd.Root> open</span>
    <span class="ml-auto flex items-center gap-1"><Kbd.Root>esc</Kbd.Root> close</span>
  </div>
{/snippet}

<div class="mx-auto flex max-w-md flex-col gap-6">
  <Command.Root>
    <Command.Input placeholder="Search a city or a command…" bind:value={search} />
    <Command.List>{@render items(search)}</Command.List>
    {@render hints()}
  </Command.Root>

  <p class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
    <Button variant="outline" size="sm" onclick={() => (open = true)}>Open as a dialog</Button>
    or press <Kbd.Group><Kbd.Root>⌘</Kbd.Root><Kbd.Root>K</Kbd.Root></Kbd.Group>
  </p>
</div>

<Command.Dialog bind:open>
  <Command.Input placeholder="Search a city or a command…" bind:value={dialogSearch} />
  <Command.List>{@render items(dialogSearch)}</Command.List>
  {@render hints()}
</Command.Dialog>

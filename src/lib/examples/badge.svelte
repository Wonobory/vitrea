<script lang="ts">
  import { Ticker } from "$lib/components/ui/ticker";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import BellIcon from "@lucide/svelte/icons/bell";
  import CheckIcon from "@lucide/svelte/icons/check";
  import FlameIcon from "@lucide/svelte/icons/flame";

  let count = $state(3);
  const bump = (d: number) => (count = Math.max(0, count + d));
</script>

<div class="flex flex-col items-center gap-6">
  <div class="flex flex-wrap items-center justify-center gap-2">
    <Badge variant="success" dot="pulse">Live</Badge>
    <Badge variant="warning" dot>Ends today</Badge>
    <Badge variant="destructive" dot>Occupied</Badge>
    <Badge variant="info"><CheckIcon /> Verified</Badge>
    <Badge variant="secondary">Ended</Badge>
  </div>

  <div class="flex flex-wrap items-center justify-center gap-2">
    <Badge>New</Badge>
    <Badge variant="info"><FlameIcon /> 12 bids</Badge>
    <Badge variant="outline">Garage</Badge>
  </div>

  <div class="flex items-center gap-3">
    <div class="relative">
      <Button variant="outline" size="icon" aria-label="Notifications, {count} unread"><BellIcon /></Button>
      {#if count > 0}
        <Badge class="absolute -top-1.5 -right-2 min-w-5 px-1.5" aria-hidden="true"><Ticker value={count} /></Badge>
      {/if}
    </div>
    <Button variant="ghost" size="sm" onclick={() => bump(1)}>Add</Button>
    <Button variant="ghost" size="sm" onclick={() => bump(-1)} disabled={count === 0}>Read one</Button>
  </div>
</div>

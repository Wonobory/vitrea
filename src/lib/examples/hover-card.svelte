<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card";
  import { Button } from "$lib/components/ui/button";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
</script>

<div class="flex justify-center">
  <HoverCard.Root>
    <HoverCard.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="link">Court of First Instance nº 3</Button>
      {/snippet}
    </HoverCard.Trigger>
    <HoverCard.Content class="w-72">
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">Court of First Instance nº 3</h4>
        <p class="text-sm text-muted-foreground">Runs 14 live auctions. Usually approves bids above 70% of value.</p>
        <div class="flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
          <CalendarIcon class="size-3.5" /> Last auction closed 3 days ago
        </div>
      </div>
    </HoverCard.Content>
  </HoverCard.Root>
</div>

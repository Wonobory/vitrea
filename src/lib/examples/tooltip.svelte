<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { Button } from "$lib/components/ui/button";
  import HeartIcon from "@lucide/svelte/icons/heart";
  import ShareIcon from "@lucide/svelte/icons/share-2";
</script>

<Tooltip.Provider>
  <div class="flex justify-center gap-3">
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" size="icon" aria-label="Follow"><HeartIcon /></Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>Follow this auction</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" size="icon" aria-label="Share"><ShareIcon /></Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">Copy link</Tooltip.Content>
    </Tooltip.Root>
  </div>
</Tooltip.Provider>

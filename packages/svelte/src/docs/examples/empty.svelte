<script lang="ts">
  import * as Empty from "$lib/components/ui/empty";
  import { Button } from "$lib/components/ui/button";
  import SearchXIcon from "@lucide/svelte/icons/search-x";
</script>

<Empty.Root class="mx-auto max-w-md border border-dashed">
  <Empty.Header>
    <Empty.Media variant="icon"><SearchXIcon /></Empty.Media>
    <Empty.Title>No auctions match</Empty.Title>
    <Empty.Description>Try widening the area or removing a filter.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <div class="flex gap-2">
      <Button>Clear filters</Button>
      <Button variant="outline">Create alert</Button>
    </div>
  </Empty.Content>
</Empty.Root>

<script lang="ts">
  import * as Item from "$lib/components/ui/item";
  import { Button } from "$lib/components/ui/button";
  import HouseIcon from "@lucide/svelte/icons/house";
  import BellIcon from "@lucide/svelte/icons/bell";
</script>

<div class="mx-auto flex w-full max-w-md flex-col gap-3">
  <Item.Root variant="outline">
    <Item.Media variant="icon"><HouseIcon /></Item.Media>
    <Item.Content>
      <Item.Title>Detached house with garden</Item.Title>
      <Item.Description>Opens tomorrow · €212,500</Item.Description>
    </Item.Content>
    <Item.Actions><Button size="sm" variant="outline">Open</Button></Item.Actions>
  </Item.Root>
  <Item.Root variant="muted" size="sm">
    <Item.Media variant="icon"><BellIcon /></Item.Media>
    <Item.Content>
      <Item.Title>3 new matches for your alert</Item.Title>
    </Item.Content>
    <Item.Actions><Button size="sm" variant="ghost">View</Button></Item.Actions>
  </Item.Root>
</div>

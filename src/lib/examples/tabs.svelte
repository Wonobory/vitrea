<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
</script>

<div class="mx-auto max-w-md">
  <Tabs.Root value="overview">
    <Tabs.List>
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="charges">Charges</Tabs.Trigger>
      <Tabs.Trigger value="area">Area</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overview" class="pt-3 text-sm text-muted-foreground">
      Two-bedroom flat, 78 m², third floor with lift. Built in 1974.
    </Tabs.Content>
    <Tabs.Content value="charges" class="pt-3 text-sm text-muted-foreground">
      One mortgage being enforced; no charges survive the auction.
    </Tabs.Content>
    <Tabs.Content value="area" class="pt-3 text-sm text-muted-foreground">
      Flats in this postcode sell for around €3,100/m².
    </Tabs.Content>
  </Tabs.Root>
</div>

<script lang="ts">
  import { Ticker } from "$lib/components/ui/ticker";
  import PageLens from "$lib/components/vitrea/PageLens.svelte";

  let page = $state(4);
</script>

<div class="flex flex-col items-center gap-4">
  <PageLens pages={12} bind:page />
  <p class="text-sm text-muted-foreground">
    Showing <span class="font-medium text-foreground"><Ticker value={(page - 1) * 20 + 1} />–<Ticker value={page * 20} /></span> of 240 auctions
  </p>
</div>

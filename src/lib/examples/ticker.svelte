<script lang="ts">
  import { Ticker } from "$lib/components/ui/ticker";
  import { Button } from "$lib/components/ui/button";

  let bids = $state(8);
  let price = $state(148_000);
  const eur = (n: number) => n.toLocaleString("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
</script>

<div class="flex flex-col items-center gap-8">
  <div class="flex items-center gap-3">
    <Button variant="outline" size="icon" aria-label="One bid less" onclick={() => (bids = Math.max(0, bids - 1))}>−</Button>
    <div class="w-28 text-center"><span class="font-display text-4xl font-semibold"><Ticker value={bids} /></span> <span class="text-sm text-muted-foreground">bids</span></div>
    <Button variant="outline" size="icon" aria-label="One bid more" onclick={() => (bids += 1)}>+</Button>
  </div>
  <div class="flex items-center gap-3">
    <Button variant="outline" size="sm" onclick={() => (price -= 5_000)}>− €5,000</Button>
    <span class="w-36 text-center text-xl font-semibold"><Ticker value={price} format={eur} /></span>
    <Button variant="outline" size="sm" onclick={() => (price += 5_000)}>+ €5,000</Button>
  </div>
  <p class="text-xs text-muted-foreground">Only the digits that change roll: up when it grows, down when it shrinks.</p>
</div>

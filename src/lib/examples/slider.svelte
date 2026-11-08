<script lang="ts">
  import { Slider } from "$lib/components/ui/slider";

  let size = $state(80);
  let price = $state([100, 300]);
</script>

<div class="mx-auto grid max-w-sm gap-8">
  <div class="grid gap-3">
    <div class="flex justify-between text-sm"><span>Size</span><span class="tabular-nums text-muted-foreground">{size} m²</span></div>
    <Slider type="single" bind:value={size} max={300} step={5} />
  </div>
  <div class="grid gap-3">
    <div class="flex justify-between text-sm"><span>Price</span><span class="tabular-nums text-muted-foreground">€{price[0]}k – €{price[1]}k</span></div>
    <Slider type="multiple" bind:value={price} max={500} step={10} />
  </div>
</div>

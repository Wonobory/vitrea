<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";

  const options = ["Has lift", "Garage included", "Not occupied"];
  let checked = $state([true, false, true]);
</script>

<div class="mx-auto grid max-w-xs gap-3">
  {#each options as o, i (o)}
    <div class="flex items-center gap-2">
      <Checkbox id="c{i}" bind:checked={checked[i]} />
      <Label for="c{i}">{o}</Label>
    </div>
  {/each}
  <div class="flex items-center gap-2">
    <Checkbox id="cd" disabled />
    <Label for="cd">Disabled</Label>
  </div>
</div>

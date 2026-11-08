<script lang="ts">
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import { Label } from "$lib/components/ui/label";

  let value = $state("court");
  const options = [
    ["court", "Court auctions"],
    ["tax", "Tax agency"],
    ["social", "Social security"],
  ];
</script>

<RadioGroup.Root bind:value class="mx-auto max-w-xs">
  {#each options as [v, text] (v)}
    <div class="flex items-center gap-2">
      <RadioGroup.Item value={v} id="r-{v}" />
      <Label for="r-{v}">{text}</Label>
    </div>
  {/each}
</RadioGroup.Root>

<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group";
  import SearchIcon from "@lucide/svelte/icons/search";
  import XIcon from "@lucide/svelte/icons/x";

  let q = $state("Barcelona");
</script>

<div class="mx-auto grid max-w-sm gap-4">
  <InputGroup.Root>
    <InputGroup.Input placeholder="Search a city or address" bind:value={q} />
    <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
    {#if q}
      <InputGroup.Addon align="inline-end">
        <InputGroup.Button size="icon-xs" aria-label="Clear" onclick={() => (q = "")}><XIcon /></InputGroup.Button>
      </InputGroup.Addon>
    {/if}
  </InputGroup.Root>
  <InputGroup.Root>
    <InputGroup.Input type="number" placeholder="150000" />
    <InputGroup.Addon align="inline-end"><InputGroup.Text>EUR</InputGroup.Text></InputGroup.Addon>
  </InputGroup.Root>
</div>

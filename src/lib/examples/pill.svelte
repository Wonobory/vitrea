<script lang="ts">
  import Pill from "$lib/components/pujarr/Pill.svelte";

  const types = [
    ["Flat", 1284],
    ["House", 412],
    ["Garage", 233],
    ["Commercial", 96],
    ["Land", 58],
    ["Warehouse", 0],
  ] as const;
  let on = $state<string[]>(["Flat"]);
  const flip = (t: string) => (on = on.includes(t) ? on.filter((x) => x !== t) : [...on, t]);
</script>

<div class="mx-auto flex max-w-md flex-wrap justify-center gap-2">
  {#each types as [t, n] (t)}
    <Pill on={on.includes(t)} label={t} {n} onclick={() => flip(t)} />
  {/each}
</div>

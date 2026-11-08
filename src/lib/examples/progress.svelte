<script lang="ts">
  import { Ticker } from "$lib/components/ui/ticker";
  import { onMount } from "svelte";
  import { Progress } from "$lib/components/ui/progress";

  let value = $state(13);
  onMount(() => {
    const t = setTimeout(() => (value = 66), 500);
    return () => clearTimeout(t);
  });
</script>

<div class="mx-auto w-full max-w-sm space-y-2">
  <div class="flex justify-between text-sm"><span>Reading documents</span><span class="text-muted-foreground"><Ticker {value} format={(n) => `${n}%`} /></span></div>
  <Progress {value} />
</div>

<script lang="ts">
  import { Switch } from "$lib/components/ui/switch";
  import { Label } from "$lib/components/ui/label";

  const settings = $state([
    { id: "new", label: "New auctions", hint: "In the areas you follow", on: true },
    { id: "drops", label: "Price drops", hint: "When a second round opens lower", on: false },
    { id: "digest", label: "Sunday digest", hint: "One email a week", on: true },
  ]);
</script>

<div class="mx-auto w-full max-w-sm divide-y rounded-xl border bg-card">
  {#each settings as s (s.id)}
    <div class="flex items-center justify-between gap-4 px-4 py-3">
      <Label for={s.id} class="flex flex-col items-start gap-0.5">
        <span>{s.label}</span>
        <span class="text-xs font-normal text-muted-foreground">{s.hint}</span>
      </Label>
      <Switch id={s.id} bind:checked={s.on} />
    </div>
  {/each}
  <div class="flex items-center justify-between gap-4 px-4 py-3">
    <Label for="compact" class="text-xs font-normal text-muted-foreground">Compact size</Label>
    <Switch id="compact" size="sm" checked />
  </div>
</div>
<p class="mt-3 text-center text-xs text-muted-foreground">Press and hold, or drag the knob.</p>

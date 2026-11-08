<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button";
</script>

<div class="flex flex-wrap justify-center gap-3">
  <Button
    variant="outline"
    onclick={() =>
      toast("Following this auction", {
        description: "We'll email you 24 hours before it closes.",
        action: { label: "Undo", onClick: () => {} },
      })}>Follow</Button
  >
  <Button variant="outline" onclick={() => toast.success("Alert saved")}>Success</Button>
  <Button variant="outline" onclick={() => toast.error("Couldn't reach the registry")}>Error</Button>
  <Button
    variant="outline"
    onclick={() =>
      toast.promise(new Promise((r) => setTimeout(r, 1500)), {
        loading: "Reading documents…",
        success: "12 documents analysed",
        error: "Failed",
      })}>Promise</Button
  >
</div>

<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<div class="mx-auto w-full max-w-xs space-y-3">
  <Skeleton class="aspect-video w-full rounded-xl" />
  <Skeleton class="h-4 w-3/4" />
  <Skeleton class="h-4 w-1/2" />
  <div class="flex gap-2 pt-1">
    <Skeleton class="h-8 flex-1" />
    <Skeleton class="size-8" />
  </div>
</div>

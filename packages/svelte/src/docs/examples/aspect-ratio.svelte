<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio";
</script>

<div class="mx-auto w-full max-w-md">
  <AspectRatio ratio={16 / 9} class="overflow-hidden rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-700">
    <div class="flex size-full items-center justify-center text-sm font-medium text-white">16 : 9</div>
  </AspectRatio>
</div>

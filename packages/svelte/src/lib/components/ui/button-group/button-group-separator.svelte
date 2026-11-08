<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import { Separator } from "$lib/components/ui/separator/index.js";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "vertical",
		...restProps
	}: ComponentProps<typeof Separator> = $props();
</script>

<Separator
	bind:ref
	data-slot="button-group-separator"
	{orientation}
	class={cn([
		"relative z-10 self-center bg-foreground/12 data-[orientation=vertical]:h-4 data-[orientation=horizontal]:mx-1.5 data-[orientation=horizontal]:w-auto",
		className,
	])}
	{...restProps}
/>

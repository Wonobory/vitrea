<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {} = $props();
</script>

<div
	bind:this={ref}
	data-slot="select-label"
	class={cn("px-2 pt-2 pb-1 text-2xs font-semibold tracking-wider text-muted-foreground uppercase", className)}
	{...restProps}
>
	{@render children?.()}
</div>

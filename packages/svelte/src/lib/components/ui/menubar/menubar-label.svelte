<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { type WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		inset,
		children,
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		inset?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="menubar-label"
	data-inset={inset}
	class={cn([
		"text-muted-foreground px-2 pt-2 pb-1 text-2xs font-semibold tracking-wider uppercase data-inset:pl-8",
		className,
	])}
	{...restProps}
>
	{@render children?.()}
</div>

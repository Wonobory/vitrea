<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="command-shortcut"
	class={cn([
		"glass-neutral ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 font-sans text-2xs font-medium text-muted-foreground group-data-selected/command-item:text-foreground",
		className,
	])}
	{...restProps}
>
	{@render children?.()}
</span>

<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="alert-action"
	class={cn([
		"mt-2.5 flex flex-wrap items-center gap-2 group-has-[>svg]/alert:col-start-2",
		className,
	])}
	{...restProps}
>
	{@render children?.()}
</div>

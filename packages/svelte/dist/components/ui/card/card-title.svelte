<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "../../../utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-title"
	class={cn("font-display text-lg leading-tight font-semibold tracking-tight [font-stretch:112%] group-data-[size=sm]/card:text-base", className)}
	{...restProps}
>
	{@render children?.()}
</div>

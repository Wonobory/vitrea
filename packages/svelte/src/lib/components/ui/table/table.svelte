<script lang="ts">
	import type { HTMLTableAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import { indicator } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLTableAttributes> = $props();
</script>

<div
	data-slot="table-container"
	class="relative w-full overflow-x-auto rounded-xl border bg-panel"
	use:indicator={{
		active: "tbody > tr[data-highlighted]",
		curve: "smooth",
		className: "glass-neutral rounded-lg",
	}}
>
	<table
		bind:this={ref}
		data-slot="table"
		class={cn(["relative w-full caption-bottom text-sm tabular-nums", className])}
		{...restProps}
	>
		{@render children?.()}
	</table>
</div>

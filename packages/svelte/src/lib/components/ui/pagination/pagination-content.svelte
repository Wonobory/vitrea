<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import { indicator } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props();
</script>

<ul
	bind:this={ref}
	data-slot="pagination-content"
	use:indicator={{ className: "glass-neutral rounded-md" }}
	class={cn(["isolate gap-1 flex items-center", className])}
	{...restProps}
>
	{@render children?.()}
</ul>

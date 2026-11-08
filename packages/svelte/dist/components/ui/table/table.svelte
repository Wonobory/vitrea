<script lang="ts">
	import type { HTMLTableAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "../../../utils.js";
	import { indicator } from "../../../indicator";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLTableAttributes> = $props();
</script>

<!-- A panel, not glass: a table is a container. The row under the pointer is
     one piece of glass that slides between rows, as in the lists
     (`$lib/indicator`; `table-body` marks the row). The table is `relative` so
     it paints above the indicator and rows measure from its top. -->
<div
	data-slot="table-container"
	class="relative w-full overflow-x-auto rounded-xl border bg-panel"
	use:indicator={{ active: "tbody > tr[data-highlighted]", attributes: ["data-highlighted"], curve: "smooth", className: "glass-neutral rounded-lg" }}
>
	<table bind:this={ref} data-slot="table" class={cn("relative w-full caption-bottom text-sm tabular-nums", className)} {...restProps}>
		{@render children?.()}
	</table>
</div>

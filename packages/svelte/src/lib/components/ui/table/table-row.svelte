<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
	bind:this={ref}
	data-slot="table-row"
	data-clickable={restProps.onclick ? "" : undefined}
	class={cn([
		"border-b border-border/70 transition-colors data-[state=selected]:bg-primary/8 data-clickable:cursor-pointer",
		className,
	])}
	{...restProps}
	onclick={restProps.onclick
		? (e) => {
				if (!(e.target as HTMLElement).closest("button, a, input, label, [role=checkbox]"))
					restProps.onclick?.(e);
			}
		: undefined}
>
	{@render children?.()}
</tr>

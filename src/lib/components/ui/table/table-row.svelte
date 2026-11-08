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

<!-- Only a row you can click gets the hover glass (`data-clickable`, read by
     `table-body`): a highlight promises an action. Clicks on controls inside
     (checkbox, link, button) are theirs, not the row's. -->
<tr
	bind:this={ref}
	data-slot="table-row"
	data-clickable={restProps.onclick ? "" : undefined}
	class={cn("border-b border-border/70 transition-colors data-[state=selected]:bg-primary/8 data-clickable:cursor-pointer", className)}
	{...restProps}
	onclick={restProps.onclick
		? (e) => {
				if (!(e.target as HTMLElement).closest("button, a, input, label, [role=checkbox]")) restProps.onclick?.(e);
			}
		: undefined}
>
	{@render children?.()}
</tr>

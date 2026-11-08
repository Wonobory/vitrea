<script lang="ts">
	import FloatingSheet from "$lib/components/floating-sheet.svelte";
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 8,
		alignOffset = -5,
		children,
		...restProps
	}: ContextMenuPrimitive.SubContentProps = $props();
</script>

<ContextMenuPrimitive.Portal>
	<ContextMenuPrimitive.SubContent
		bind:ref
		forceMount
		{sideOffset}
		{alignOffset}
		data-slot="context-menu-sub-content"
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			<FloatingSheet {wrapperProps} {props} {open} menu class={cn(["min-w-36", className])}>
				{@render children?.()}
			</FloatingSheet>
		{/snippet}
	</ContextMenuPrimitive.SubContent>
</ContextMenuPrimitive.Portal>

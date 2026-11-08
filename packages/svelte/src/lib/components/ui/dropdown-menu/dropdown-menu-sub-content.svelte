<script lang="ts">
	import FloatingSheet from "$lib/components/floating-sheet.svelte";
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 8,
		alignOffset = -5,
		children,
		...restProps
	}: DropdownMenuPrimitive.SubContentProps = $props();
</script>

<DropdownMenuPrimitive.Portal>
	<DropdownMenuPrimitive.SubContent
		bind:ref
		forceMount
		{sideOffset}
		{alignOffset}
		data-slot="dropdown-menu-sub-content"
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			<FloatingSheet {wrapperProps} {props} {open} menu class={cn(["min-w-36", className])}>
				{@render children?.()}
			</FloatingSheet>
		{/snippet}
	</DropdownMenuPrimitive.SubContent>
</DropdownMenuPrimitive.Portal>

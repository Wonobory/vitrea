<script lang="ts">
	import FloatingSheet from "$lib/components/floating-sheet.svelte";
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import DropdownMenuPortal from "./dropdown-menu-portal.svelte";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		sideOffset = 6,
		align = "start",
		portalProps,
		class: className,
		children,
		...restProps
	}: DropdownMenuPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DropdownMenuPortal>>;
	} = $props();
</script>

<DropdownMenuPortal {...portalProps}>
	<DropdownMenuPrimitive.Content
		bind:ref
		forceMount
		data-slot="dropdown-menu-content"
		{sideOffset}
		{align}
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			<FloatingSheet
				{wrapperProps}
				{props}
				{open}
				menu
				class={cn([
					"min-w-[max(10rem,var(--bits-dropdown-menu-anchor-width))] max-h-(--bits-dropdown-menu-content-available-height)",
					className,
				])}
			>
				{@render children?.()}
			</FloatingSheet>
		{/snippet}
	</DropdownMenuPrimitive.Content>
</DropdownMenuPortal>

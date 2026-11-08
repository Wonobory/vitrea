<script lang="ts">
	import FloatingSheet from "$lib/components/floating-sheet.svelte";
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import ContextMenuPortal from "./context-menu-portal.svelte";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		portalProps,
		class: className,
		children,
		...restProps
	}: ContextMenuPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof ContextMenuPortal>>;
	} = $props();
</script>

<ContextMenuPortal {...portalProps}>
	<ContextMenuPrimitive.Content bind:ref forceMount data-slot="context-menu-content" {...restProps}>
		{#snippet child({ wrapperProps, props, open })}
			<FloatingSheet
				{wrapperProps}
				{props}
				{open}
				menu
				class={cn(["min-w-44 max-h-(--bits-context-menu-content-available-height)", className])}
			>
				{@render children?.()}
			</FloatingSheet>
		{/snippet}
	</ContextMenuPrimitive.Content>
</ContextMenuPortal>

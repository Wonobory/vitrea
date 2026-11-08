<script lang="ts">
	import FloatingSheet from "$lib/components/floating-sheet.svelte";
	import { Popover as PopoverPrimitive } from "bits-ui";
	import PopoverPortal from "./popover-portal.svelte";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 6,
		align = "center",
		portalProps,
		children,
		...restProps
	}: PopoverPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>;
	} = $props();
</script>

<PopoverPortal {...portalProps}>
	<PopoverPrimitive.Content
		bind:ref
		forceMount
		data-slot="popover-content"
		{sideOffset}
		{align}
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			<FloatingSheet
				{wrapperProps}
				{props}
				{open}
				class={cn([
					"flex w-72 flex-col gap-4 p-4 text-sm text-popover-foreground outline-hidden",
					className,
				])}
			>
				{@render children?.()}
			</FloatingSheet>
		{/snippet}
	</PopoverPrimitive.Content>
</PopoverPortal>

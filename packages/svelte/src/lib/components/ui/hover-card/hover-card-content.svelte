<script lang="ts">
	import FloatingSheet from "$lib/components/floating-sheet.svelte";
	import { LinkPreview as HoverCardPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import HoverCardPortal from "./hover-card-portal.svelte";
	import type { ComponentProps } from "svelte";
	import GlassArrow from "$lib/components/vitrea/GlassArrow.svelte";

	let {
		ref = $bindable(null),
		class: className,
		align = "center",
		sideOffset = 8,
		portalProps,
		children,
		...restProps
	}: HoverCardPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof HoverCardPortal>>;
	} = $props();
</script>

<HoverCardPortal {...portalProps}>
	<HoverCardPrimitive.Content
		bind:ref
		forceMount
		data-slot="hover-card-content"
		{align}
		{sideOffset}
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			<FloatingSheet
				{wrapperProps}
				{props}
				{open}
				class={cn(["w-64 p-4 text-sm text-popover-foreground outline-hidden", className])}
			>
				{@render children?.()}
				<GlassArrow />
			</FloatingSheet>
		{/snippet}
	</HoverCardPrimitive.Content>
</HoverCardPortal>

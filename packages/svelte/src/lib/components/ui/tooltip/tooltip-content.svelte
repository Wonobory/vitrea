<script lang="ts">
	import FloatingSheet from "$lib/components/floating-sheet.svelte";
	import { tooltipIn } from "$lib/transitions";
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import TooltipPortal from "./tooltip-portal.svelte";
	import type { ComponentProps } from "svelte";
	import GlassArrow from "$lib/components/vitrea/GlassArrow.svelte";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 6,
		side = "top",
		children,
		arrowClasses: _arrowClasses,
		portalProps,
		...restProps
	}: TooltipPrimitive.ContentProps & {
		/** Kept for API compatibility: the arrow is the glass one (`GlassArrow`). */
		arrowClasses?: string;
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof TooltipPortal>>;
	} = $props();
</script>

<TooltipPortal {...portalProps}>
	<TooltipPrimitive.Content
		bind:ref
		forceMount
		data-slot="tooltip-content"
		{sideOffset}
		{side}
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			<FloatingSheet
				{wrapperProps}
				{props}
				{open}
				enter={tooltipIn}
				class={cn([
					"inline-flex w-fit max-w-xs items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium has-data-[slot=kbd]:pr-1.5",
					className,
				])}
			>
				{@render children?.()}
				<GlassArrow />
			</FloatingSheet>
		{/snippet}
	</TooltipPrimitive.Content>
</TooltipPortal>

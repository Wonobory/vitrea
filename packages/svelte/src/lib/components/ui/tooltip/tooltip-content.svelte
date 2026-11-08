<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import TooltipPortal from "./tooltip-portal.svelte";
	import type { ComponentProps } from "svelte";
	import { fade } from "svelte/transition";
	import GlassArrow from "$lib/components/vitrea/GlassArrow.svelte";
	import { fadeScale, FLOATING_OUT } from "$lib/transitions";
	import { springXSmall } from "$lib/springs";

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
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn([
							"glass-panel z-50 inline-flex w-fit max-w-xs origin-(--bits-floating-transform-origin) items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium has-data-[slot=kbd]:pr-1.5",
							className,
						])}
						in:fadeScale={{ duration: 220, easing: springXSmall, minScale: 0.85 }}
						out:fade={{ duration: FLOATING_OUT }}
					>
						{@render children?.()}
						<GlassArrow />
					</div>
				</div>
			{/if}
		{/snippet}
	</TooltipPrimitive.Content>
</TooltipPortal>

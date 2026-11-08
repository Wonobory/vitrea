<script lang="ts">
	import { LinkPreview as HoverCardPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import HoverCardPortal from "./hover-card-portal.svelte";
	import type { ComponentProps } from "svelte";
	import { fade } from "svelte/transition";
	import GlassArrow from "$lib/components/vitrea/GlassArrow.svelte";
	import { floatingIn, fadeScale, FLOATING_OUT } from "$lib/transitions";

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
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn([
							"glass-panel z-50 w-64 origin-(--bits-floating-transform-origin) rounded-xl p-4 text-sm text-popover-foreground outline-hidden",
							className,
						])}
						in:fadeScale={floatingIn}
						out:fade={{ duration: FLOATING_OUT }}
					>
						{@render children?.()}
						<GlassArrow />
					</div>
				</div>
			{/if}
		{/snippet}
	</HoverCardPrimitive.Content>
</HoverCardPortal>

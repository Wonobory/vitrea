<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import DropdownMenuPortal from "./dropdown-menu-portal.svelte";
	import type { ComponentProps } from "svelte";
	import { fade } from "svelte/transition";
	import { floatingIn, fadeScale, FLOATING_OUT } from "$lib/transitions";
	import { indicator, menuHighlight } from "$lib/indicator";

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
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn([
							"glass-panel z-50 min-w-[max(10rem,var(--bits-dropdown-menu-anchor-width))] max-h-(--bits-dropdown-menu-content-available-height) origin-(--bits-floating-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl p-1 text-popover-foreground outline-none",
							className,
						])}
						use:indicator={menuHighlight}
						in:fadeScale={floatingIn}
						out:fade={{ duration: FLOATING_OUT }}
					>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</DropdownMenuPrimitive.Content>
</DropdownMenuPortal>

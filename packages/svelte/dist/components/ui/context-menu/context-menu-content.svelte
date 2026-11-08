<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "../../../utils.js";
	import ContextMenuPortal from "./context-menu-portal.svelte";
	import type { ComponentProps } from "svelte";
	import { fade } from "svelte/transition";
	import { floatingIn, fadeScale, FLOATING_OUT } from "../../../transitions";
	import { indicator } from "../../../indicator";

	// The highlighted row, or the sub-menu trigger whose sub-menu is open.
	const HIGHLIGHTED = '[data-highlighted], [data-state="open"][data-slot$="sub-trigger"]';

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

<!-- Glass sheet that grows from where it opened (see popover-content). -->
<ContextMenuPortal {...portalProps}>
	<ContextMenuPrimitive.Content bind:ref forceMount data-slot="context-menu-content" {...restProps}>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn(
							"glass-panel z-50 min-w-44 max-h-(--bits-context-menu-content-available-height) origin-(--bits-floating-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl p-1 text-popover-foreground outline-none",
							className
						)}
						use:indicator={{ active: HIGHLIGHTED, attributes: ["data-highlighted"], curve: "smooth", className: "glass-neutral rounded-md" }}
						in:fadeScale={floatingIn}
						out:fade={{ duration: FLOATING_OUT }}
					>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</ContextMenuPrimitive.Content>
</ContextMenuPortal>

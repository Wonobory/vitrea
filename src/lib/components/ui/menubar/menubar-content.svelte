<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import MenubarPortal from "./menubar-portal.svelte";
	import type { ComponentProps } from "svelte";
	import { fade } from "svelte/transition";
	import { floatingIn, fadeScale, FLOATING_OUT } from "$lib/transitions";
	import { indicator } from "$lib/indicator";

	// The highlighted row, or the sub-menu trigger whose sub-menu is open.
	const HIGHLIGHTED = '[data-highlighted], [data-state="open"][data-slot$="sub-trigger"]';

	let {
		ref = $bindable(null),
		sideOffset = 8,
		alignOffset = -4,
		align = "start",
		side = "bottom",
		portalProps,
		class: className,
		children,
		onCloseAutoFocus,
		...restProps
	}: MenubarPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof MenubarPortal>>;
	} = $props();

	// Closing, bits-ui hands focus back to this menu's trigger. When it closes because another menu
	// of the bar opened, the new sheet (which traps focus) is already up: it sees focus leave and
	// pulls it onto its first item, which lit up. Moving left the new sheet mounts first, so it was
	// always that way. Focus is already going to the new menu: don't hand it back.
	function closeAutoFocus(e: Event) {
		onCloseAutoFocus?.(e);
		const trigger = document.getElementById(ref?.getAttribute("aria-labelledby") ?? "");
		if (trigger?.closest('[role="menubar"]')?.querySelector('[data-slot="menubar-trigger"][data-state="open"]')) e.preventDefault();
	}
</script>

<!-- Glass sheet that grows from where it opened (see popover-content). -->
<MenubarPortal {...portalProps}>
	<MenubarPrimitive.Content bind:ref forceMount data-slot="menubar-content" {align} {alignOffset} {side} {sideOffset} onCloseAutoFocus={closeAutoFocus} {...restProps}>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn(
							"glass-panel z-50 min-w-44 origin-(--bits-floating-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl p-1 text-popover-foreground outline-none",
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
	</MenubarPrimitive.Content>
</MenubarPortal>

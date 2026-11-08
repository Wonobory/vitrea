<script lang="ts">
	import FloatingSheet from "$lib/components/floating-sheet.svelte";
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import MenubarPortal from "./menubar-portal.svelte";
	import type { ComponentProps } from "svelte";

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

	const closeAutoFocus = (e: Event) => {
		onCloseAutoFocus?.(e);
		const trigger = document.getElementById(ref?.getAttribute("aria-labelledby") ?? "");
		if (
			trigger
				?.closest('[role="menubar"]')
				?.querySelector('[data-slot="menubar-trigger"][data-state="open"]')
		)
			e.preventDefault();
	};
</script>

<MenubarPortal {...portalProps}>
	<MenubarPrimitive.Content
		bind:ref
		forceMount
		data-slot="menubar-content"
		{align}
		{alignOffset}
		{side}
		{sideOffset}
		onCloseAutoFocus={closeAutoFocus}
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			<FloatingSheet {wrapperProps} {props} {open} menu class={cn(["min-w-44", className])}>
				{@render children?.()}
			</FloatingSheet>
		{/snippet}
	</MenubarPrimitive.Content>
</MenubarPortal>

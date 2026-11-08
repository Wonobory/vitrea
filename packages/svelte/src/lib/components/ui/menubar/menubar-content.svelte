<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import MenubarPortal from "./menubar-portal.svelte";
	import type { ComponentProps } from "svelte";
	import { fade } from "svelte/transition";
	import { floatingIn, fadeScale, FLOATING_OUT } from "$lib/transitions";
	import { indicator } from "$lib/indicator";

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
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn([
							"glass-panel z-50 min-w-44 origin-(--bits-floating-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl p-1 text-popover-foreground outline-none",
							className,
						])}
						use:indicator={{
							active: HIGHLIGHTED,
							attributes: ["data-highlighted"],
							curve: "smooth",
							className: "glass-neutral rounded-md",
						}}
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

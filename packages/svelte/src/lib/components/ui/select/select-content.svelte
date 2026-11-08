<script lang="ts">
	import FloatingSheet from "$lib/components/floating-sheet.svelte";
	import { Select as SelectPrimitive } from "bits-ui";
	import SelectPortal from "./select-portal.svelte";
	import SelectScrollUpButton from "./select-scroll-up-button.svelte";
	import SelectScrollDownButton from "./select-scroll-down-button.svelte";
	import { cn, type WithoutChild } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import type { WithoutChildrenOrChild } from "$lib/utils.js";
	import { indicator } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 6,
		portalProps,
		children,
		preventScroll = true,
		...restProps
	}: WithoutChild<SelectPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SelectPortal>>;
	} = $props();
</script>

<SelectPortal {...portalProps}>
	<SelectPrimitive.Content
		bind:ref
		forceMount
		{sideOffset}
		{preventScroll}
		data-slot="select-content"
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			<FloatingSheet
				{wrapperProps}
				{props}
				{open}
				class={cn([
					"flex max-h-(--bits-select-content-available-height) min-w-36 flex-col overflow-hidden p-1 text-popover-foreground",
					className,
				])}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport class="w-full min-w-(--bits-select-anchor-width) scroll-my-1">
					<div
						class="relative"
						use:indicator={{
							active: "[data-highlighted]",
							curve: "smooth",
							className: "glass-neutral rounded-lg",
						}}
					>
						{@render children?.()}
					</div>
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</FloatingSheet>
		{/snippet}
	</SelectPrimitive.Content>
</SelectPortal>

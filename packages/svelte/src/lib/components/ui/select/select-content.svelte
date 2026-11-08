<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import SelectPortal from "./select-portal.svelte";
	import SelectScrollUpButton from "./select-scroll-up-button.svelte";
	import SelectScrollDownButton from "./select-scroll-down-button.svelte";
	import { cn, type WithoutChild } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import type { WithoutChildrenOrChild } from "$lib/utils.js";
	import { fade } from "svelte/transition";
	import { floatingIn, fadeScale, FLOATING_OUT } from "$lib/transitions";
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
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn([
							"glass-panel z-50 flex max-h-(--bits-select-content-available-height) min-w-36 origin-(--bits-floating-transform-origin) flex-col overflow-hidden rounded-xl p-1 text-popover-foreground",
							className,
						])}
						in:fadeScale={floatingIn}
						out:fade={{ duration: FLOATING_OUT }}
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
					</div>
				</div>
			{/if}
		{/snippet}
	</SelectPrimitive.Content>
</SelectPortal>

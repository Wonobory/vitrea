<script lang="ts" module>
	export type { Side } from "$lib/transitions";
</script>

<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";
	import SheetPortal from "./sheet-portal.svelte";
	import SheetOverlay from "./sheet-overlay.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import XIcon from "@lucide/svelte/icons/x";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import { sheetSlide, SHEET_OUT, type Side } from "$lib/transitions";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		side = "right",
		showCloseButton = true,
		portalProps,
		children,
		restoreScrollDelay = SHEET_OUT,
		...restProps
	}: WithoutChildrenOrChild<SheetPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SheetPortal>>;
		side?: Side;
		showCloseButton?: boolean;
		children: Snippet;
	} = $props();
</script>

<SheetPortal {...portalProps}>
	<SheetOverlay />
	<SheetPrimitive.Content
		bind:ref
		forceMount
		data-slot="sheet-content"
		data-side={side}
		{restoreScrollDelay}
		{...restProps}
	>
		{#snippet child({ props, open })}
			{#if open}
				<div
					{...props}
					class={cn([
						"glass-panel text-popover-foreground fixed z-50 flex flex-col gap-4 rounded-2xl text-sm outline-none",
						"data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:w-[calc(75%-0.5rem)] data-[side=right]:sm:max-w-sm",
						"data-[side=left]:inset-y-2 data-[side=left]:left-2 data-[side=left]:w-[calc(75%-0.5rem)] data-[side=left]:sm:max-w-sm",
						"data-[side=top]:inset-x-2 data-[side=top]:top-2 data-[side=bottom]:inset-x-2 data-[side=bottom]:bottom-2",
						className,
					])}
					in:sheetSlide={{ side }}
					out:sheetSlide={{ side, leaving: true }}
				>
					{@render children?.()}
					{#if showCloseButton}
						<SheetPrimitive.Close data-slot="sheet-close">
							{#snippet child({ props })}
								<Button variant="ghost" class="absolute top-3 right-3" size="icon-sm" {...props}>
									<XIcon />
									<span class="sr-only">Close</span>
								</Button>
							{/snippet}
						</SheetPrimitive.Close>
					{/if}
				</div>
			{/if}
		{/snippet}
	</SheetPrimitive.Content>
</SheetPortal>

<script lang="ts" module>
	import { springXSmall } from "$lib/springs";
	import { cubicIn } from "svelte/easing";
	export type Side = "top" | "right" | "bottom" | "left";

	/** Off-screen start, as a translate, for each side (the sheet floats 8px in from the edge). */
	const OFFSCREEN: Record<Side, (k: number) => string> = {
		right: (k) => `calc(${k} * (100% + 0.5rem)) 0`,
		left: (k) => `calc(${-k} * (100% + 0.5rem)) 0`,
		bottom: (k) => `0 calc(${k} * (100% + 0.5rem))`,
		top: (k) => `0 calc(${-k} * (100% + 0.5rem))`,
	};

	const SHEET_OUT = 220;

	/** Slides in with the modal spring (a few px of overshoot fit in the 8px gap), out with a quick ease-in. */
	function slideIn(_: Element, { side, leaving }: { side: Side; leaving?: boolean }) {
		return {
			duration: leaving ? SHEET_OUT : 480,
			easing: leaving ? cubicIn : springXSmall,
			css: (t: number) => `translate: ${OFFSCREEN[side](1 - t)};`,
		};
	}
</script>

<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";
	import SheetPortal from "./sheet-portal.svelte";
	import SheetOverlay from "./sheet-overlay.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import XIcon from "@lucide/svelte/icons/x";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		side = "right",
		showCloseButton = true,
		portalProps,
		children,
		// Unlock the page once the modal has faded out: unlocked mid-fade, the scrollbar came back
		// and narrowed the window under a modal centred on it, which slid ~8 px left.
		restoreScrollDelay = SHEET_OUT,
		...restProps
	}: WithoutChildrenOrChild<SheetPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SheetPortal>>;
		side?: Side;
		showCloseButton?: boolean;
		children: Snippet;
	} = $props();
</script>

<!-- A floating glass sheet, 8px in from its edge, that springs in from off-screen. -->
<SheetPortal {...portalProps}>
	<SheetOverlay />
	<SheetPrimitive.Content bind:ref forceMount data-slot="sheet-content" data-side={side} {restoreScrollDelay} {...restProps}>
		{#snippet child({ props, open })}
			{#if open}
				<div
					{...props}
					class={cn(
						"glass-panel text-popover-foreground fixed z-50 flex flex-col gap-4 rounded-2xl text-sm outline-none",
						"data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:w-[calc(75%-0.5rem)] data-[side=right]:sm:max-w-sm",
						"data-[side=left]:inset-y-2 data-[side=left]:left-2 data-[side=left]:w-[calc(75%-0.5rem)] data-[side=left]:sm:max-w-sm",
						"data-[side=top]:inset-x-2 data-[side=top]:top-2 data-[side=bottom]:inset-x-2 data-[side=bottom]:bottom-2",
						className
					)}
					in:slideIn={{ side }}
					out:slideIn={{ side, leaving: true }}
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

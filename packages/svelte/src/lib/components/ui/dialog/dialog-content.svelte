<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import DialogPortal from "./dialog-portal.svelte";
	import type { Snippet } from "svelte";
	import * as Dialog from "./index.js";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import XIcon from '@lucide/svelte/icons/x';
	import { fade } from "svelte/transition";
	import { modalIn, fadeScale, EXIT } from "$lib/transitions";

	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		showCloseButton = true,
		// Unlock the page once the modal has faded out: unlocked mid-fade, the scrollbar came back
		// and narrowed the window under a modal centred on it, which slid ~8 px left.
		restoreScrollDelay = EXIT,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DialogPortal>>;
		children: Snippet;
		showCloseButton?: boolean;
	} = $props();
</script>

<DialogPortal {...portalProps}>
	<Dialog.Overlay />
	<!-- `forceMount` + `child`: in and out with Svelte transitions
	     (`$lib/transitions`), not CSS animations. -->
	<DialogPrimitive.Content
		bind:ref
		forceMount
		data-slot="dialog-content"
		class={cn(
			"glass-panel text-popover-foreground grid max-w-[calc(100%-2rem)] gap-6 rounded-2xl p-6 text-sm sm:max-w-md fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none",
			className
		)}
		{restoreScrollDelay}
		{...restProps}
	>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} in:fadeScale={modalIn} out:fade={{ duration: EXIT }}>
					{@render children?.()}
					{#if showCloseButton}
						<DialogPrimitive.Close data-slot="dialog-close">
							{#snippet child({ props })}
								<Button variant="ghost" class="absolute top-4 right-4" size="icon-sm" {...props}>
									<XIcon />
									<span class="sr-only">Close</span>
								</Button>
							{/snippet}
						</DialogPrimitive.Close>
					{/if}
				</div>
			{/if}
		{/snippet}
	</DialogPrimitive.Content>
</DialogPortal>

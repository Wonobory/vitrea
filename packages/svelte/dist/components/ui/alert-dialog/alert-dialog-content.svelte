<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import AlertDialogPortal from "./alert-dialog-portal.svelte";
	import AlertDialogOverlay from "./alert-dialog-overlay.svelte";
	import { cn, type WithoutChild, type WithoutChildrenOrChild } from "../../../utils.js";
	import type { ComponentProps } from "svelte";
	import { fade } from "svelte/transition";
	import { modalIn, fadeScale, EXIT } from "../../../transitions";

	let {
		ref = $bindable(null),
		class: className,
		size = "default",
		portalProps,
		children,
		// Unlock the page once the modal has faded out: unlocked mid-fade, the scrollbar came back
		// and narrowed the window under a modal centred on it, which slid ~8 px left.
		restoreScrollDelay = EXIT,
		...restProps
	}: WithoutChild<AlertDialogPrimitive.ContentProps> & {
		size?: "default" | "sm";
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof AlertDialogPortal>>;
	} = $props();
</script>

<AlertDialogPortal {...portalProps}>
	<AlertDialogOverlay />
	<!-- `forceMount` + `child`: in and out with Svelte transitions
	     (`$lib/transitions`), not CSS animations. -->
	<AlertDialogPrimitive.Content
		bind:ref
		forceMount
		data-slot="alert-dialog-content"
		data-size={size}
		class={cn(
			"glass-panel text-popover-foreground gap-6 rounded-2xl p-6 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none",
			className
		)}
		{restoreScrollDelay}
		{...restProps}
	>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} in:fadeScale={modalIn} out:fade={{ duration: EXIT }}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</AlertDialogPrimitive.Content>
</AlertDialogPortal>

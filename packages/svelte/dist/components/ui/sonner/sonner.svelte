<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import { mode } from "mode-watcher";
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import OctagonXIcon from '@lucide/svelte/icons/octagon-x';
	import InfoIcon from '@lucide/svelte/icons/info';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

	let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
	theme={mode.current}
	class="toaster group"
	// Any drag dismisses. By default only right and down did (towards the corner); left and up
	// were damped to a few px, and the toast seemed frozen under the pointer.
	swipeDirections={["top", "right", "bottom", "left"]}
	style="--normal-bg: var(--color-card); --normal-text: var(--color-popover-foreground); --normal-border: transparent; --border-radius: var(--radius-xl);"
	toastOptions={{
		// Glass sheets like the rest of the floating surfaces: sonner's own shadow
		// and border lose to the glass rim (`glass-panel` + its `--glass-rim`).
		classes: {
			// `select-none`: dragging from the text started a selection, and sonner ignores a swipe while
			// any text is selected, so the toast froze under the pointer.
			toast: "glass-panel !shadow-(--glass-rim) gap-2.5 select-none",
			title: "font-medium",
			description: "!text-muted-foreground",
			actionButton: "glass-fill !rounded-md !font-medium",
			cancelButton: "glass-neutral !rounded-md",
		},
	}}
	{...restProps}
>
	{#snippet loadingIcon()}
		<Loader2Icon class="size-4 animate-spin" />
	{/snippet}
	{#snippet successIcon()}
		<CircleCheckIcon class="size-4 text-success" />
	{/snippet}
	{#snippet errorIcon()}
		<OctagonXIcon class="size-4 text-danger" />
	{/snippet}
	{#snippet infoIcon()}
		<InfoIcon class="size-4" />
	{/snippet}
	{#snippet warningIcon()}
		<TriangleAlertIcon class="size-4 text-warning" />
	{/snippet}
</Sonner>

<style>
	/* Sonner borrows the toast's ::before as an invisible swipe and hover area (2–3× the toast while
	   pressed or leaving), and the glass edge lives there: pressing a toast blew the edge up into a
	   ring around it, behind the toast. Pinned to the toast; the swipe still works, since sonner
	   captures the pointer on press. */
	:global([data-sonner-toast].glass-panel::before) {
		inset: 0 !important;
		height: auto !important;
		transform: none !important;
		z-index: auto !important;
	}
</style>

<script lang="ts" generics="T = never">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { getContext } from "svelte";
	import { TAP } from "./tooltip.svelte";

	let {
		ref = $bindable(null),
		onpointerdown,
		onclick,
		...restProps
	}: TooltipPrimitive.TriggerProps<T> = $props();

	const tap = getContext<(() => void) | undefined>(TAP);
	let touch = false;
</script>

<TooltipPrimitive.Trigger
	bind:ref
	data-slot="tooltip-trigger"
	onpointerdown={(e) => {
		touch = e.pointerType === "touch";
		onpointerdown?.(e);
	}}
	onclick={(e) => {
		onclick?.(e);
		if (touch) tap?.();
	}}
	{...restProps}
/>

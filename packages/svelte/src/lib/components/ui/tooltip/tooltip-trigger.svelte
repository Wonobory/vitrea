<script lang="ts" generics="T = never">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { getTap } from "./tooltip.svelte";

	let {
		ref = $bindable(null),
		onpointerdown,
		onclick,
		...restProps
	}: TooltipPrimitive.TriggerProps<T> = $props();

	const tap = getTap();
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
		if (touch) tap();
	}}
	{...restProps}
/>

<script lang="ts">
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { Tween } from "svelte/motion";
	import { MediaQuery } from "svelte/reactivity";
	import { cn, type WithoutChildrenOrChild } from "../../../utils.js";
	import { cubicOut } from "svelte/easing";

	let {
		ref = $bindable(null),
		class: className,
		max = 100,
		value,
		...restProps
	}: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props();

	const reduced = new MediaQuery("prefers-reduced-motion: reduce");
	const pct = (v: number | null | undefined) => Math.max(0, Math.min(100, (100 * (v ?? 0)) / (max || 1)));
	// svelte-ignore state_referenced_locally
	const width = new Tween(pct(value), { duration: 400, easing: cubicOut });
	$effect(() => {
		width.set(pct(value), reduced.current ? { duration: 0 } : undefined);
	});
</script>

<!-- The fill is filled glass and eases to each new value, without overshoot: a bar that passes
     its value and comes back reads as wrong progress. It grows in width
     (not a translate) so the glass rim stays round at both ends. -->
<ProgressPrimitive.Root
	bind:ref
	data-slot="progress"
	class={cn("relative flex h-2 w-full items-center rounded-full bg-foreground/8 p-px shadow-[inset_0_1px_2px_rgb(0_0_0/0.12)]", className)}
	{value}
	{max}
	{...restProps}
>
	<div
		data-slot="progress-indicator"
		class="glass-fill h-full rounded-full"
		style="width: {width.current}%; min-width: {width.current > 0 ? '0.375rem' : '0'}"
	></div>
</ProgressPrimitive.Root>

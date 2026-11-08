<script lang="ts">
	import { PinInput as InputOTPPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { scale } from "svelte/transition";
	import { springXSmall } from "$lib/springs";

	let {
		ref = $bindable(null),
		cell,
		class: className,
		...restProps
	}: InputOTPPrimitive.CellProps = $props();
</script>

<!-- A recessed field per digit. The focus frame is the root's sliding one; the
     active slot only lifts to the card colour. The root's `data-status` drives
     the waves, each slot delayed by its position (`--i`). -->
<InputOTPPrimitive.Cell
	{cell}
	bind:ref
	data-slot="input-otp-slot"
	class={cn(
		"relative flex h-12 w-10 items-center justify-center rounded-lg border border-foreground/15 bg-[color-mix(in_oklch,var(--muted)_70%,var(--card))] font-mono text-xl font-medium tabular-nums shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] outline-none dark:border-input dark:bg-[color-mix(in_oklch,var(--background)_35%,var(--card))] dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)]",
		"transition-[background-color,border-color,color,box-shadow] duration-300 [transition-delay:calc(var(--i,0)*45ms)]",
		"data-active:bg-card data-active:shadow-none data-active:[transition-delay:0ms]",
		"group-data-[status=verifying]/otp:animate-[otp-wave_1.1s_ease-in-out_infinite] group-data-[status=verifying]/otp:[animation-delay:calc(var(--i,0)*90ms)]",
		"group-data-[status=success]/otp:border-success/60! group-data-[status=success]/otp:bg-success/12! group-data-[status=success]/otp:text-success",
		"group-data-[status=error]/otp:border-danger/60! group-data-[status=error]/otp:bg-danger/10! group-data-[status=error]/otp:text-danger group-data-[status=error]/otp:[transition-delay:0ms]",
		"aria-invalid:border-danger",
		className
	)}
	{...restProps}
>
	{#key cell.char}
		{#if cell.char}<span in:scale={{ duration: 300, start: 0.5, easing: springXSmall }}>{cell.char}</span>{/if}
	{/key}
	{#if cell.hasFakeCaret}
		<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
			<div class="animate-caret-blink h-6 w-px bg-primary duration-1000"></div>
		</div>
	{/if}
</InputOTPPrimitive.Cell>

<style>
	/* Checking: a soft lift travels along the slots. */
	@keyframes -global-otp-wave {
		0%, 60%, 100% { translate: 0 0; opacity: 1; }
		25% { translate: 0 -3px; opacity: 0.55; }
	}
</style>

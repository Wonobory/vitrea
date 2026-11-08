<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { press } from "$lib/press";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: RangeCalendarPrimitive.DayProps = $props();
</script>

<RangeCalendarPrimitive.Day bind:ref {...restProps}>
	{#snippet child({ props, day, ...state })}
		{@const isEnd = [
			"data-range-start",
			"data-range-end",
			"data-selection-start",
			"data-selection-end",
		].some((k) => props[k] !== undefined)}
		{@const isMiddle = props["data-range-middle"] !== undefined}
		<div
			{...props}
			use:press={!isMiddle}
			class={cn([
				"flex size-(--cell-size) flex-col items-center justify-center gap-1 rounded-(--cell-radius) p-0 text-sm leading-none font-normal whitespace-nowrap tabular-nums transition-colors outline-none select-none",
				isEnd ? "glass-fill font-medium" : isMiddle ? "relative text-foreground" : "glass-ghost",
				"[&[data-today]:not([data-selected])]:font-semibold [&[data-today]:not([data-selected])]:text-primary",
				"[&[data-outside-month]:not([data-selected])]:text-muted-foreground/60",
				"data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
				"data-[unavailable]:line-through",
				"[&>span]:text-xs [&>span]:opacity-70",
				className,
			])}
		>
			{#if children}{@render children({ day, ...state })}{:else}{day}{/if}
		</div>
	{/snippet}
</RangeCalendarPrimitive.Day>

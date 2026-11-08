<script lang="ts">
	import { cn } from "../../../utils.js";
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { press } from "../../../press";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: CalendarPrimitive.DayProps = $props();
</script>

<!-- Every day is a small glass button: ghost until hovered, filled glass when
     chosen. Today is marked by colour, not a box, so it never competes with
     the selection. Today is marked by colour, not a box, so it never competes with
     the selection. -->
<CalendarPrimitive.Day bind:ref {...restProps}>
	{#snippet child({ props, selected, day, disabled, unavailable })}
		<div
			{...props}
			use:press
			class={cn(
				"flex size-(--cell-size) flex-col items-center justify-center gap-1 rounded-(--cell-radius) p-0 text-sm leading-none font-normal whitespace-nowrap tabular-nums transition-colors outline-none select-none",
				selected ? "glass-fill font-medium" : "glass-ghost",
				"[&[data-today]:not([data-selected])]:font-semibold [&[data-today]:not([data-selected])]:text-primary",
				"[&[data-outside-month]:not([data-selected])]:text-muted-foreground/60",
				"data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
				"data-[unavailable]:text-muted-foreground data-[unavailable]:line-through",
				"[&>span]:text-xs [&>span]:opacity-70",
				className
			)}
		>
			{#if children}{@render children({ selected, day, disabled, unavailable })}{:else}{day}{/if}
		</div>
	{/snippet}
</CalendarPrimitive.Day>

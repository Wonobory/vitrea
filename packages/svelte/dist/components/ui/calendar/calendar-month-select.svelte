<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "../../../utils.js";
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	let {
		ref = $bindable(null),
		class: className,
		value,
		onchange,
		...restProps
	}: WithoutChildrenOrChild<CalendarPrimitive.MonthSelectProps> = $props();
</script>

<span
	class={cn(
		"relative flex rounded-md border border-foreground/15 dark:border-input bg-[color-mix(in_oklch,var(--muted)_70%,var(--card))] shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] transition-[background-color,border-color,box-shadow] hover:border-foreground/30 dark:hover:border-foreground/20 has-focus:border-ring has-focus:bg-card has-focus:shadow-none has-focus:ring-3 has-focus:ring-ring/20 dark:bg-[color-mix(in_oklch,var(--background)_35%,var(--card))] dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)]",
		className
	)}
>
	<CalendarPrimitive.MonthSelect
		bind:ref
		class="bg-background dark:bg-popover dark:text-popover-foreground absolute inset-0 opacity-0"
		{...restProps}
	>
		{#snippet child({ props, monthItems, selectedMonthItem })}
			<select {...props} {value} {onchange}>
				{#each monthItems as monthItem (monthItem.value)}
					<option
						value={monthItem.value}
						selected={value !== undefined
							? monthItem.value === value
							: monthItem.value === selectedMonthItem.value}
					>
						{monthItem.label}
					</option>
				{/each}
			</select>
			<span
				class="[&>svg]:text-muted-foreground flex h-(--cell-size) items-center gap-1 rounded-md ps-2 pe-1 text-sm font-medium select-none [&>svg]:size-3.5"
				aria-hidden="true"
			>
				{monthItems.find((item) => item.value === value)?.label || selectedMonthItem.label}
				<ChevronDownIcon class={cn("size-4", className)} />
			</span>
		{/snippet}
	</CalendarPrimitive.MonthSelect>
</span>

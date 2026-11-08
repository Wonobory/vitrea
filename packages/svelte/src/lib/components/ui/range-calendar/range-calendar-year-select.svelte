<script lang="ts">
	import { fieldWell } from "$lib/components/ui/input/field-class.js";
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

	let {
		ref = $bindable(null),
		class: className,
		value,
		...restProps
	}: WithoutChildrenOrChild<RangeCalendarPrimitive.YearSelectProps> = $props();
</script>

<span
	class={cn([
		fieldWell,
		"relative flex rounded-md transition-[background-color,border-color,box-shadow] hover:border-foreground/30 dark:hover:border-foreground/20 has-focus:border-ring has-focus:bg-card has-focus:shadow-none has-focus:ring-3 has-focus:ring-ring/20",
		className,
	])}
>
	<RangeCalendarPrimitive.YearSelect bind:ref class="absolute inset-0 opacity-0" {...restProps}>
		{#snippet child({ props, yearItems, selectedYearItem })}
			<select {...props} {value}>
				{#each yearItems as yearItem (yearItem.value)}
					<option
						value={yearItem.value}
						selected={value !== undefined
							? yearItem.value === value
							: yearItem.value === selectedYearItem.value}
					>
						{yearItem.label}
					</option>
				{/each}
			</select>
			<span
				class="[&>svg]:text-muted-foreground flex h-(--cell-size) items-center gap-1 rounded-md ps-2 pe-1 text-sm font-medium select-none [&>svg]:size-3.5"
				aria-hidden="true"
			>
				{yearItems.find((item) => item.value === value)?.label || selectedYearItem.label}
				<ChevronDownIcon class={cn(["size-4", className])} />
			</span>
		{/snippet}
	</RangeCalendarPrimitive.YearSelect>
</span>

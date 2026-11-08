<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import * as RangeCalendar from "./index.js";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import type { ButtonVariant } from "$lib/components/ui/button/index.js";
	import type { Snippet } from "svelte";
	import { fuse } from "$lib/fuse";
	import { isEqualMonth, type DateValue } from "@internationalized/date";

	let {
		ref = $bindable(null),
		value = $bindable(),
		placeholder = $bindable(),
		weekdayFormat = "short",
		class: className,
		buttonVariant = "ghost",
		captionLayout = "label",
		locale = "en-US",
		months: monthsProp,
		years,
		monthFormat: monthFormatProp,
		yearFormat = "numeric",
		day,
		disableDaysOutsideMonth = false,
		...restProps
	}: WithoutChildrenOrChild<RangeCalendarPrimitive.RootProps> & {
		buttonVariant?: ButtonVariant;
		captionLayout?: "dropdown" | "dropdown-months" | "dropdown-years" | "label";
		months?: RangeCalendarPrimitive.MonthSelectProps["months"];
		years?: RangeCalendarPrimitive.YearSelectProps["years"];
		monthFormat?: RangeCalendarPrimitive.MonthSelectProps["monthFormat"];
		yearFormat?: RangeCalendarPrimitive.YearSelectProps["yearFormat"];
		day?: Snippet<[{ day: DateValue; outsideMonth: boolean }]>;
	} = $props();

	const inRange = (el: HTMLElement) =>
		!el.hasAttribute("data-outside-month") &&
		(el.hasAttribute("data-selected") || el.hasAttribute("data-highlighted"));

	const monthFormat = $derived.by(() => {
		if (monthFormatProp) return monthFormatProp;
		if (captionLayout.startsWith("dropdown")) return "short";
		return "long";
	});
</script>

<RangeCalendarPrimitive.Root
	bind:ref
	bind:value
	bind:placeholder
	{weekdayFormat}
	{disableDaysOutsideMonth}
	class={cn([
		"p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(9)] bg-panel group/calendar p-3 [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
		className,
	])}
	{locale}
	{monthFormat}
	{yearFormat}
	{...restProps}
>
	{#snippet children({ months, weekdays })}
		<RangeCalendar.Months>
			<RangeCalendar.Nav>
				<RangeCalendar.PrevButton variant={buttonVariant} />
				<RangeCalendar.NextButton variant={buttonVariant} />
			</RangeCalendar.Nav>
			{#each months as month, monthIndex (month.value.toString())}
				<RangeCalendar.Month>
					<RangeCalendar.Header>
						<RangeCalendar.Caption
							{captionLayout}
							months={monthsProp}
							{monthFormat}
							{years}
							{yearFormat}
							month={month.value}
							bind:placeholder
							{locale}
							{monthIndex}
						/>
					</RangeCalendar.Header>

					<div
						use:fuse={{
							items: "[data-bits-day]",
							on: inRange,
							row: (el) => el.closest("tr"),
							watch: ["data-selected", "data-highlighted"],
							className:
								"glass-neutral rounded-(--cell-radius) [--glass-veil:color-mix(in_oklab,var(--primary)_14%,transparent)]",
						}}
					>
						<RangeCalendar.Grid>
							<RangeCalendar.GridHead>
								<RangeCalendar.GridRow class="select-none">
									{#each weekdays as weekday, i (i)}
										<RangeCalendar.HeadCell>
											{weekday.slice(0, 2)}
										</RangeCalendar.HeadCell>
									{/each}
								</RangeCalendar.GridRow>
							</RangeCalendar.GridHead>
							<RangeCalendar.GridBody>
								{#each month.weeks as weekDates (weekDates)}
									<RangeCalendar.GridRow class="mt-2 w-full">
										{#each weekDates as date (date)}
											<RangeCalendar.Cell {date} month={month.value}>
												{#if day}
													{@render day({
														day: date,
														outsideMonth: !isEqualMonth(date, month.value),
													})}
												{:else}
													<RangeCalendar.Day />
												{/if}
											</RangeCalendar.Cell>
										{/each}
									</RangeCalendar.GridRow>
								{/each}
							</RangeCalendar.GridBody>
						</RangeCalendar.Grid>
					</div>
				</RangeCalendar.Month>
			{/each}
		</RangeCalendar.Months>
	{/snippet}
</RangeCalendarPrimitive.Root>

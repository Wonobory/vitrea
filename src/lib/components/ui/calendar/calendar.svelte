<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import * as Calendar from "./index.js";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import type { ButtonVariant } from "../button/button.svelte";
	import { DateFormatter, getLocalTimeZone, isEqualMonth, type DateValue } from "@internationalized/date";
	import type { Snippet } from "svelte";
	import { fade } from "svelte/transition";
	import { press } from "$lib/press";
	import { Button } from "$lib/components/ui/button";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

	let {
		ref = $bindable(null),
		value = $bindable(),
		placeholder = $bindable(),
		class: className,
		weekdayFormat = "short",
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
	}: WithoutChildrenOrChild<CalendarPrimitive.RootProps> & {
		buttonVariant?: ButtonVariant;
		captionLayout?: "dropdown" | "dropdown-months" | "dropdown-years" | "label";
		months?: CalendarPrimitive.MonthSelectProps["months"];
		years?: CalendarPrimitive.YearSelectProps["years"];
		monthFormat?: CalendarPrimitive.MonthSelectProps["monthFormat"];
		yearFormat?: CalendarPrimitive.YearSelectProps["yearFormat"];
		day?: Snippet<[{ day: DateValue; outsideMonth: boolean }]>;
	} = $props();

	const monthFormat = $derived.by(() => {
		if (monthFormatProp) return monthFormatProp;
		if (captionLayout.startsWith("dropdown")) return "short";
		return "long";
	});

	/**
	 * With the label caption, the title is a button: it turns the days into the
	 * twelve months of the year (with the year on arrows). Pick one and you're
	 * back on its days. No dropdowns.
	 */
	let view = $state<"days" | "months">("days");
	const tz = getLocalTimeZone();
	const title = $derived(new DateFormatter(locale, { month: "long", year: "numeric" }));
	const short = $derived(new DateFormatter(locale, { month: "short" }));
	const goTo = (d: DateValue) => (placeholder = d);
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<CalendarPrimitive.Root
	bind:value={value as never}
	bind:ref
	bind:placeholder
	{weekdayFormat}
	{disableDaysOutsideMonth}
	class={cn(
		"p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(9)] bg-panel group/calendar in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
		className
	)}
	{locale}
	{monthFormat}
	{yearFormat}
	{...restProps}
>
	{#snippet children({ months, weekdays })}
		<Calendar.Months>
			<Calendar.Nav class={view === "months" ? "invisible" : undefined}>
				<Calendar.PrevButton variant={buttonVariant} />
				<Calendar.NextButton variant={buttonVariant} />
			</Calendar.Nav>
			{#each months as month, monthIndex (month.value.toString())}
				<Calendar.Month>
					<Calendar.Header>
						{#if captionLayout === "label"}
							<button
								type="button"
								use:press
								class="glass-ghost inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-sm font-medium"
								aria-expanded={view === "months"}
								onclick={() => (view = view === "days" ? "months" : "days")}
							>
								{title.format(month.value.toDate(tz))}
								<ChevronDownIcon class={cn("size-3.5 opacity-60 transition-transform", view === "months" && "rotate-180")} />
							</button>
						{:else}
							<Calendar.Caption
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
						{/if}
					</Calendar.Header>
					<div class="relative">
						{#if view === "months"}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="absolute inset-0 z-10 flex flex-col gap-2"
								transition:fade={{ duration: 120 }}
								onkeydown={(e) => e.key === "Escape" && (view = "days")}
							>
								<div class="flex items-center justify-between">
									<Button variant="ghost" size="icon-sm" aria-label="Previous year" onclick={() => goTo(month.value.subtract({ years: 1 }))}><ChevronLeftIcon /></Button>
									<span class="text-sm font-semibold tabular-nums">{month.value.year}</span>
									<Button variant="ghost" size="icon-sm" aria-label="Next year" onclick={() => goTo(month.value.add({ years: 1 }))}><ChevronRightIcon /></Button>
								</div>
								<div class="grid flex-1 grid-cols-3 gap-1.5">
									{#each { length: 12 } as _, i (i)}
										{@const m = month.value.set({ month: i + 1, day: 1 })}
										<button
											type="button"
											use:press
											class={cn(
												"rounded-(--cell-radius) text-sm transition-colors",
												i + 1 === month.value.month ? "glass-fill font-medium" : "glass-ghost"
											)}
											aria-current={i + 1 === month.value.month ? "date" : undefined}
											onclick={() => {
												goTo(m);
												view = "days";
											}}>{short.format(m.toDate(tz))}</button
										>
									{/each}
								</div>
							</div>
						{/if}
					<Calendar.Grid class={view === "months" ? "invisible" : undefined}>
						<Calendar.GridHead>
							<Calendar.GridRow class="select-none">
								{#each weekdays as weekday, i (i)}
									<Calendar.HeadCell>
										{weekday.slice(0, 2)}
									</Calendar.HeadCell>
								{/each}
							</Calendar.GridRow>
						</Calendar.GridHead>
						<Calendar.GridBody>
							{#each month.weeks as weekDates (weekDates)}
								<Calendar.GridRow class="mt-2 w-full">
									{#each weekDates as date (date)}
										<Calendar.Cell {date} month={month.value}>
											{#if day}
												{@render day({
													day: date,
													outsideMonth: !isEqualMonth(date, month.value),
												})}
											{:else}
												<Calendar.Day />
											{/if}
										</Calendar.Cell>
									{/each}
								</Calendar.GridRow>
							{/each}
						</Calendar.GridBody>
					</Calendar.Grid>
					</div>
				</Calendar.Month>
			{/each}
		</Calendar.Months>
	{/snippet}
</CalendarPrimitive.Root>

<script lang="ts">
	import * as RangeCalendar from "$lib/components/ui/range-calendar";
	import { getDayOfWeek, getLocalTimeZone, today, type DateValue } from "@internationalized/date";

	const start = today(getLocalTimeZone());
	let value = $state<{ start: DateValue | undefined; end: DateValue | undefined }>({
		start,
		end: start.add({ days: 6 }),
	});

	const closing = (d: DateValue) =>
		getDayOfWeek(d, "en-GB") > 4
			? 0
			: (Math.imul(d.year * 400 + d.month * 32 + d.day, 2654435761) >>> 0) % 18;
	const dots = (n: number) => (n === 0 ? 0 : n < 6 ? 1 : n < 12 ? 2 : 3);

	const summary = $derived.by(() => {
		const { start, end } = value;
		if (!start || !end) return null;
		let total = 0;
		let days = 0;
		for (let d = start; d.compare(end) <= 0; d = d.add({ days: 1 })) {
			total += closing(d);
			days++;
		}
		return { days, total };
	});
</script>

<div class="flex flex-col items-center gap-3">
	<RangeCalendar.RangeCalendar
		bind:value
		numberOfMonths={2}
		class="rounded-xl border bg-card shadow-sm"
	>
		{#snippet day({ day })}
			<RangeCalendar.Day>
				{#snippet children({ day: label })}
					{label}
					<span class="flex h-1 gap-0.5" aria-hidden="true">
						{#each { length: dots(closing(day)) } as _, i (i)}
							<i class="size-1 rounded-full bg-current opacity-70"></i>
						{/each}
					</span>
				{/snippet}
			</RangeCalendar.Day>
		{/snippet}
	</RangeCalendar.RangeCalendar>
	<p class="text-xs text-muted-foreground tabular-nums" aria-live="polite">
		{#if summary}
			{summary.days} days ·
			<span class="font-medium text-foreground">{summary.total} auctions</span> close · Example data
		{:else}
			Pick the last day
		{/if}
	</p>
</div>

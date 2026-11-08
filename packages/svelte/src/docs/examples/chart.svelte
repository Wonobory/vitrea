<script lang="ts">
	import Histogram from "$lib/components/vitrea/Histogram.svelte";
	import Segmented from "$lib/components/vitrea/Segmented.svelte";
	import * as Chart from "$lib/components/ui/chart";
	import { BarChart } from "layerchart";

	const shapes = {
		flats: [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 19, 9, 10, 9, 22, 10, 8, 6, 5, 4, 3, 2, 1, 1],
		houses: [2, 2, 3, 4, 5, 6, 7, 8, 8, 8, 16, 8, 7, 6, 14, 6, 5, 4, 3, 2, 2, 1, 1, 0],
		garages: [6, 7, 9, 10, 11, 10, 9, 8, 6, 5, 12, 4, 3, 3, 7, 2, 2, 1, 1, 1, 0, 0, 0, 0],
	};
	let type = $state<keyof typeof shapes>("flats");

	const monthly = [
		{ month: "May", auctions: 186 },
		{ month: "Jun", auctions: 205 },
		{ month: "Jul", auctions: 237 },
		{ month: "Aug", auctions: 173 },
		{ month: "Sep", auctions: 209 },
		{ month: "Oct", auctions: 264 },
	];
	const config = {
		auctions: { label: "Auctions", color: "var(--chart-1)" },
	} satisfies Chart.ChartConfig;
</script>

<div class="mx-auto w-full max-w-xl space-y-10">
	<section class="space-y-4">
		<div class="flex flex-wrap items-end justify-between gap-3">
			<div>
				<h3 class="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
					Winning bid, % of value
				</h3>
				<p class="text-sm text-muted-foreground">Bids pile up right at the legal thresholds.</p>
			</div>
			<Segmented
				options={[
					["flats", "Flats"],
					["houses", "Houses"],
					["garages", "Garages"],
				]}
				value={type}
				onSelect={(v) => (type = v)}
				label="Property type"
				role="radio"
				glass
				compact
				class="w-56"
			/>
		</div>
		<Histogram bins={shapes[type]} label="Where winning bids land for {type}" />
	</section>

	<section class="space-y-3">
		<h3 class="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
			Auctions per month · LayerChart
		</h3>
		<Chart.Container {config} class="aspect-auto h-48 w-full">
			<BarChart
				data={monthly}
				x="month"
				bandPadding={0.35}
				axis="x"
				series={[{ key: "auctions", label: config.auctions.label, color: config.auctions.color }]}
				props={{
					bars: { stroke: "none", rounded: "top", radius: 6 },
					highlight: { area: { fill: "none" } },
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</section>
</div>

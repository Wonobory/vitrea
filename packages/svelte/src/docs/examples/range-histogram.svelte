<script lang="ts">
	import RangeHistogram from "$lib/components/vitrea/RangeHistogram.svelte";
	import { Input } from "$lib/components/ui/input";

	let seed = 7;
	const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
	const normal = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
	const prices = Array.from(
		{ length: 1200 },
		() => Math.round(10 ** (5.05 + 0.42 * normal()) / 1000) * 1000
	);
	const years = Array.from({ length: 1200 }, () =>
		Math.round(rand() < 0.7 ? 1975 + 14 * normal() : 2004 + 4 * normal())
	).map((y) => Math.min(2025, Math.max(1900, y)));

	let priceMin = $state("");
	let priceMax = $state("");
	let yearMin = $state("1960");
	let yearMax = $state("");

	const twoDigits = (v: number) => {
		const step = 10 ** (Math.floor(Math.log10(v)) - 1);
		return Math.round(v / step) * step;
	};
	const show = (v: string, thousands: boolean) =>
		v && thousands ? Number(v).toLocaleString("en-GB") : v;
	const kEur = (v: number) =>
		v >= 1e6
			? `${(v / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 1 })}M`
			: v >= 1000
				? `${Math.round(v / 1000)}k`
				: String(v);
</script>

{#snippet fields(
	min: string,
	max: string,
	set: (a: string, b: string) => void,
	unit: string,
	name: string,
	thousands = true
)}
	<div class="flex items-center gap-2">
		<Input
			inputmode="numeric"
			placeholder="Min"
			aria-label="{name}, minimum"
			value={show(min, thousands)}
			oninput={(e) => set(e.currentTarget.value.replace(/\D/g, ""), max)}
		/>
		<span class="shrink-0 text-xs text-muted-foreground">–</span>
		<Input
			inputmode="numeric"
			placeholder="Max"
			aria-label="{name}, maximum"
			value={show(max, thousands)}
			oninput={(e) => set(min, e.currentTarget.value.replace(/\D/g, ""))}
		/>
		<span class="w-6 shrink-0 text-xs text-muted-foreground">{unit}</span>
	</div>
{/snippet}

<div class="mx-auto w-full max-w-xs space-y-8">
	<div class="space-y-2.5">
		<RangeHistogram
			title="Price"
			values={prices}
			min={priceMin}
			max={priceMax}
			onChange={(a, b) => ((priceMin = a), (priceMax = b))}
			lo={5_000}
			hi={2_000_000}
			round={twoDigits}
			short={kEur}
			unit="€"
			ticks={[
				[10_000, "10k"],
				[100_000, "100k"],
				[1_000_000, "1M"],
			]}
		/>
		{@render fields(priceMin, priceMax, (a, b) => ((priceMin = a), (priceMax = b)), "€", "Price")}
	</div>

	<div class="space-y-2.5">
		<RangeHistogram
			sub
			title="Year built"
			values={years}
			min={yearMin}
			max={yearMax}
			onChange={(a, b) => ((yearMin = a), (yearMax = b))}
			lo={1900}
			hi={2025}
			log={false}
			round={Math.round}
			short={String}
			ticks={[
				[1925, "1925"],
				[1975, "1975"],
				[2025, "2025"],
			]}
		/>
		{@render fields(
			yearMin,
			yearMax,
			(a, b) => ((yearMin = a), (yearMax = b)),
			"",
			"Year built",
			false
		)}
	</div>
</div>

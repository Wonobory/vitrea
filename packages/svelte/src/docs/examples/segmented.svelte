<script lang="ts">
	import Segmented from "$lib/components/vitrea/Segmented.svelte";

	let view = $state<"map" | "list" | "grid">("map");
	let range = $state<"day" | "week" | "month" | "year">("week");
</script>

<div class="mx-auto flex max-w-sm flex-col gap-6">
	<Segmented
		options={[
			["map", "Map"],
			["list", "List"],
			["grid", "Grid"],
		]}
		value={view}
		onSelect={(v) => (view = v)}
		label="View"
		role="radio"
		glass
	/>
	<Segmented
		options={[
			["day", "Day"],
			["week", "Week"],
			["month", "Month"],
			["year", "Year"],
		]}
		value={range}
		onSelect={(v) => (range = v)}
		label="Range"
		role="radio"
		glass
		compact
		subtle
	/>
</div>

<script lang="ts">
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Switch } from "$lib/components/ui/switch";
	import { Label } from "$lib/components/ui/label";

	const cities: [string, number][] = [
		["Alicante", 89],
		["Almería", 41],
		["Badajoz", 23],
		["Barcelona", 76],
		["Bilbao", 18],
		["Cádiz", 34],
		["Córdoba", 29],
		["Girona", 31],
		["Granada", 38],
		["Huelva", 22],
		["Lleida", 27],
		["Madrid", 64],
		["Málaga", 58],
		["Murcia", 52],
		["Palma", 19],
		["Seville", 47],
		["Tarragona", 36],
		["Toledo", 25],
		["Valencia", 71],
		["Zaragoza", 33],
	];
	const types = [
		"Flats",
		"Houses",
		"Garages",
		"Commercial",
		"Storage",
		"Land",
		"Rural",
		"Offices",
		"Industrial",
		"Plots",
	];

	let drag = $state(true);
</script>

<div class="mx-auto flex w-full max-w-md flex-col items-center gap-6">
	<div class="flex items-center gap-2.5">
		<Switch id="drag" size="sm" bind:checked={drag} />
		<Label for="drag">Drag to scroll</Label>
	</div>

	<ScrollArea {drag} class="h-64 w-60 rounded-xl border bg-card">
		<ul class="p-1.5">
			{#each cities as [city, n] (city)}
				<li
					class="flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-foreground/[0.04]"
				>
					{city}<span class="text-xs text-muted-foreground tabular-nums">{n}</span>
				</li>
			{/each}
		</ul>
	</ScrollArea>

	<ScrollArea {drag} orientation="horizontal" class="w-full max-w-sm">
		<div class="flex gap-2 p-1 pb-4">
			{#each types as t (t)}
				<span class="glass-neutral shrink-0 rounded-full px-3 py-1.5 text-sm">{t}</span>
			{/each}
		</div>
	</ScrollArea>
	<p class="-mt-3 text-xs text-muted-foreground">
		With the mouse: drag and let go to flick. The edges fade only while there's more to scroll.
		Example data.
	</p>
</div>

<script lang="ts">
	import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import AlignLeftIcon from "@lucide/svelte/icons/align-left";
	import AlignCenterIcon from "@lucide/svelte/icons/align-center";
	import AlignRightIcon from "@lucide/svelte/icons/align-right";

	let align = $state("left");
	let rooms = $state<string[]>(["2", "3"]);
	let days = $state<string[]>(["mon", "tue", "wed", "fri"]);
	let types = $state<string[]>(["flat"]);

	const DAYS = [
		["mon", "M", "Monday"],
		["tue", "T", "Tuesday"],
		["wed", "W", "Wednesday"],
		["thu", "T", "Thursday"],
		["fri", "F", "Friday"],
		["sat", "S", "Saturday"],
		["sun", "S", "Sunday"],
	];
	const label = "text-2xs font-semibold tracking-wider text-muted-foreground uppercase";
</script>

<div class="flex flex-col items-center gap-7">
	<div class="flex flex-col items-center gap-2">
		<span class={label}>Single · the selection slides</span>
		<ToggleGroup.Root type="single" bind:value={align}>
			<ToggleGroup.Item value="left" aria-label="Left"><AlignLeftIcon /></ToggleGroup.Item>
			<ToggleGroup.Item value="center" aria-label="Center"><AlignCenterIcon /></ToggleGroup.Item>
			<ToggleGroup.Item value="right" aria-label="Right"><AlignRightIcon /></ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	<div class="flex flex-col items-center gap-2">
		<span class={label}>Multiple · neighbours fuse</span>
		<ToggleGroup.Root type="multiple" bind:value={rooms} aria-label="Bedrooms">
			{#each ["1", "2", "3", "4", "5+"] as r (r)}
				<ToggleGroup.Item value={r} class="min-w-12">{r}</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
		<ToggleGroup.Root type="multiple" bind:value={days} aria-label="Alert days">
			{#each DAYS as [value, short, name] (value)}
				<ToggleGroup.Item {value} aria-label={name} class="min-w-9">{short}</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
	</div>

	<div class="flex flex-col items-center gap-2">
		<span class={label}>Spaced</span>
		<ToggleGroup.Root type="multiple" bind:value={types} spacing={1.5} aria-label="Property type">
			{#each [["flat", "Flat"], ["house", "House"], ["garage", "Garage"], ["land", "Land"]] as [value, name] (value)}
				<ToggleGroup.Item {value}>{name}</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
	</div>
</div>

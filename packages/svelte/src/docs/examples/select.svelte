<script lang="ts">
	import * as Select from "$lib/components/ui/select";

	const types = [
		{ value: "flat", label: "Flat" },
		{ value: "house", label: "House" },
		{ value: "garage", label: "Garage" },
		{ value: "land", label: "Land" },
	];
	let value = $state("");
	const label = $derived(types.find((t) => t.value === value)?.label ?? "Property type");
</script>

<div class="flex justify-center">
	<Select.Root type="single" bind:value>
		<Select.Trigger class="w-48">{label}</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Residential</Select.Label>
				{#each types.slice(0, 2) as t (t.value)}
					<Select.Item value={t.value} label={t.label} />
				{/each}
			</Select.Group>
			<Select.Separator />
			<Select.Group>
				<Select.Label>Other</Select.Label>
				{#each types.slice(2) as t (t.value)}
					<Select.Item value={t.value} label={t.label} />
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>

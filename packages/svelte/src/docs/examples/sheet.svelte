<script lang="ts">
	import * as Sheet from "$lib/components/ui/sheet";
	import { Button } from "$lib/components/ui/button";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Label } from "$lib/components/ui/label";

	const types = ["Flat", "House", "Garage", "Commercial", "Land"];
</script>

<div class="flex justify-center">
	<Sheet.Root>
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline">Filters</Button>
			{/snippet}
		</Sheet.Trigger>
		<Sheet.Content side="right">
			<Sheet.Header>
				<Sheet.Title>Filters</Sheet.Title>
				<Sheet.Description>Narrow down the listings on the map.</Sheet.Description>
			</Sheet.Header>
			<div class="grid gap-3 px-4">
				{#each types as t, i (t)}
					<div class="flex items-center gap-2">
						<Checkbox id="t-{t}" checked={i < 2} />
						<Label for="t-{t}">{t}</Label>
					</div>
				{/each}
			</div>
			<Sheet.Footer>
				<Sheet.Close>
					{#snippet child({ props })}
						<Button {...props}>Show 1,284 results</Button>
					{/snippet}
				</Sheet.Close>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>
</div>

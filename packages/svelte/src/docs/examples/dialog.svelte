<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	let open = $state(false);
</script>

<div class="flex justify-center">
	<Dialog.Root bind:open>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline">Set a price alert</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Price alert</Dialog.Title>
				<Dialog.Description
					>We'll email you when a new listing in this area matches.</Dialog.Description
				>
			</Dialog.Header>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="area">Area</Label>
					<Input id="area" value="Barcelona" />
				</div>
				<div class="grid gap-2">
					<Label for="max">Maximum price (€)</Label>
					<Input id="max" type="number" value="180000" />
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
				<Button onclick={() => (open = false)}>Save alert</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>

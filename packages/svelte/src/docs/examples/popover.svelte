<script lang="ts">
	import * as Popover from "$lib/components/ui/popover";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
</script>

<div class="flex justify-center">
	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline">Size</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-72">
			<Popover.Header>
				<Popover.Title>Floor area</Popover.Title>
				<Popover.Description>Built area in square metres.</Popover.Description>
			</Popover.Header>
			<div class="grid grid-cols-2 gap-3">
				<div class="grid gap-1.5">
					<Label for="min">Min</Label>
					<Input id="min" type="number" value="60" />
				</div>
				<div class="grid gap-1.5">
					<Label for="maxm">Max</Label>
					<Input id="maxm" type="number" value="120" />
				</div>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>

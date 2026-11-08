<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import MapPinIcon from "@lucide/svelte/icons/map-pin";
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title>2-bed flat, city centre</Card.Title>
		<Card.Description class="flex items-center gap-1"
			><MapPinIcon class="size-3.5" /> Example Street 12, 3rd floor</Card.Description
		>
		<Card.Action><Badge variant="secondary">Open</Badge></Card.Action>
	</Card.Header>
	<Card.Content class="grid grid-cols-3 gap-2 text-sm">
		<div>
			<div class="text-muted-foreground">Value</div>
			<div class="font-medium tabular-nums">€148,000</div>
		</div>
		<div>
			<div class="text-muted-foreground">Area</div>
			<div class="font-medium tabular-nums">82 m²</div>
		</div>
		<div>
			<div class="text-muted-foreground">Ends in</div>
			<div class="font-medium tabular-nums">4 days</div>
		</div>
	</Card.Content>
	<Card.Footer class="gap-2">
		<Button class="flex-1">View details</Button>
		<Button variant="outline">Follow</Button>
	</Card.Footer>
</Card.Root>

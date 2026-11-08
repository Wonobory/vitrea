<script lang="ts">
	import { Ticker } from "$lib/components/ui/ticker";
	import * as ButtonGroup from "$lib/components/ui/button-group";
	import { Button } from "$lib/components/ui/button";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ArchiveIcon from "@lucide/svelte/icons/archive";
	import FlagIcon from "@lucide/svelte/icons/flag";
	import ShareIcon from "@lucide/svelte/icons/share";

	const pages = 12;
	let page = $state(3);
	const go = (d: number) => (page = Math.min(pages, Math.max(1, page + d)));
</script>

<div class="flex flex-col items-center gap-6">
	<ButtonGroup.Root aria-label="Listing actions">
		<Button variant="ghost"><ArchiveIcon /> Archive</Button>
		<Button variant="ghost"><FlagIcon /> Report</Button>
		<Button variant="ghost"><ShareIcon /> Share</Button>
	</ButtonGroup.Root>

	<ButtonGroup.Root aria-label="Pages">
		<Button
			variant="ghost"
			size="icon"
			aria-label="Previous page"
			disabled={page === 1}
			onclick={() => go(-1)}><ChevronLeftIcon /></Button
		>
		<ButtonGroup.Separator />
		<ButtonGroup.Text aria-live="polite">
			Page
			<Ticker value={page} />
			<span class="text-muted-foreground">of {pages}</span>
		</ButtonGroup.Text>
		<ButtonGroup.Separator />
		<Button
			variant="ghost"
			size="icon"
			aria-label="Next page"
			disabled={page === pages}
			onclick={() => go(1)}><ChevronRightIcon /></Button
		>
	</ButtonGroup.Root>
</div>

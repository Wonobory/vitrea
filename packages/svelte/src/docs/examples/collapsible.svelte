<script lang="ts">
	import * as Collapsible from "$lib/components/ui/collapsible";
	import { Badge } from "$lib/components/ui/badge";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

	let open = $state(false);
	const charges = [
		["Mortgage", "2015", "€96,000"],
		["Tax lien", "2021", "€4,310"],
		["Easement of way", "1987", "—"],
	];
	const [first, ...rest] = charges;
</script>

{#snippet row([what, year, amount]: string[])}
	<div class="flex items-center justify-between rounded-lg border bg-panel px-4 py-2.5 text-sm">
		<span>{what} <span class="text-muted-foreground">· {year}</span></span>
		<span class="font-medium tabular-nums">{amount}</span>
	</div>
{/snippet}

<Collapsible.Root bind:open class="mx-auto w-full max-w-sm space-y-2">
	<Collapsible.Trigger
		class="group flex w-full items-center gap-2 rounded-md py-1 text-left text-sm font-semibold transition-colors hover:text-foreground/80"
	>
		Registry charges
		<Badge variant="secondary">{charges.length}</Badge>
		<span
			class="ml-auto text-xs font-normal text-muted-foreground transition-opacity duration-200 group-aria-expanded:opacity-0"
		>
			+{rest.length} more
		</span>
		<ChevronDownIcon
			class="size-4 shrink-0 text-muted-foreground transition-[rotate] duration-400 ease-(--spring-small) group-aria-expanded:rotate-180"
		/>
	</Collapsible.Trigger>
	{@render row(first)}
	<Collapsible.Content class="space-y-2">
		{#each rest as charge (charge[0])}
			{@render row(charge)}
		{/each}
	</Collapsible.Content>
</Collapsible.Root>

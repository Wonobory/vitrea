<script lang="ts">
	import { Ticker } from "$lib/components/ui/ticker";
	import * as Table from "$lib/components/ui/table";
	import { Badge } from "$lib/components/ui/badge";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";

	type Row = {
		id: string;
		type: string;
		city: string;
		region: string;
		m2: number;
		value: number;
		days: number;
		status: "Open" | "Soon" | "Ended";
	};
	const rows: Row[] = [
		{
			id: "A-1042",
			type: "Flat",
			city: "Valencia",
			region: "Valencia",
			m2: 82,
			value: 148000,
			days: 4,
			status: "Open",
		},
		{
			id: "A-1043",
			type: "Garage",
			city: "Madrid",
			region: "Madrid",
			m2: 12,
			value: 18500,
			days: 1,
			status: "Open",
		},
		{
			id: "A-1044",
			type: "House",
			city: "Girona",
			region: "Catalonia",
			m2: 164,
			value: 212500,
			days: 12,
			status: "Soon",
		},
		{
			id: "A-1045",
			type: "Commercial",
			city: "Seville",
			region: "Andalusia",
			m2: 120,
			value: 96000,
			days: 0,
			status: "Ended",
		},
		{
			id: "A-1046",
			type: "Flat",
			city: "Bilbao",
			region: "Basque Country",
			m2: 70,
			value: 131000,
			days: 7,
			status: "Open",
		},
	];
	const tone = { Open: "success", Soon: "warning", Ended: "secondary" } as const;

	type Column = "value" | "eurM2" | "days";
	let sort = $state<{ col: Column; asc: boolean }>({ col: "days", asc: true });
	const key = (r: Row, c: Column) => (c === "eurM2" ? r.value / r.m2 : r[c]);
	const sorted = $derived(
		[...rows].sort((a, b) => (key(a, sort.col) - key(b, sort.col)) * (sort.asc ? 1 : -1))
	);
	const sortBy = (col: Column) => (sort = { col, asc: sort.col === col ? !sort.asc : false });

	let selected = $state<string[]>([]);
	const allSelected = $derived(selected.length === rows.length);
	const total = $derived(
		rows.filter((r) => selected.includes(r.id)).reduce((t, r) => t + r.value, 0)
	);
	const toggle = (id: string) =>
		(selected = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

	const eur = (n: number) =>
		n.toLocaleString("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
</script>

{#snippet header(col: Column, label: string)}
	<Table.Head
		class="text-right"
		aria-sort={sort.col === col ? (sort.asc ? "ascending" : "descending") : "none"}
	>
		<button
			type="button"
			onclick={() => sortBy(col)}
			class={[
				"inline-flex items-center gap-1 uppercase transition-colors hover:text-foreground",
				sort.col === col && "text-foreground",
			]}
		>
			<ArrowUpIcon
				class={[
					"size-3 transition-[rotate,opacity] duration-500 ease-(--spring-small)",
					sort.col === col ? "opacity-100" : "opacity-0",
					!sort.asc && "rotate-180",
				]}
			/>
			{label}
		</button>
	</Table.Head>
{/snippet}

<div class="mx-auto max-w-2xl">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-10">
					<Checkbox
						checked={allSelected}
						indeterminate={selected.length > 0 && !allSelected}
						onCheckedChange={(v) => (selected = v ? rows.map((r) => r.id) : [])}
						aria-label="Select all"
					/>
				</Table.Head>
				<Table.Head>Property</Table.Head>
				{@render header("value", "Value")}
				{@render header("eurM2", "€/m²")}
				{@render header("days", "Ends")}
				<Table.Head>Status</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each sorted as r (r.id)}
				<Table.Row
					data-state={selected.includes(r.id) ? "selected" : undefined}
					onclick={() => toggle(r.id)}
				>
					<Table.Cell>
						<Checkbox
							checked={selected.includes(r.id)}
							onCheckedChange={() => toggle(r.id)}
							aria-label="Select {r.id}"
						/>
					</Table.Cell>
					<Table.Cell>
						<div class="font-medium">{r.type} in {r.city}</div>
						<div class="text-xs text-muted-foreground">
							{r.region} · {r.m2} m² · <span class="font-mono">{r.id}</span>
						</div>
					</Table.Cell>
					<Table.Cell class="text-right font-medium">{eur(r.value)}</Table.Cell>
					<Table.Cell class="text-right text-muted-foreground">{eur(r.value / r.m2)}</Table.Cell>
					<Table.Cell class="text-right text-muted-foreground"
						>{r.status === "Ended" ? "—" : r.days === 1 ? "1 day" : `${r.days} days`}</Table.Cell
					>
					<Table.Cell>
						<Badge variant={tone[r.status]}>
							<span class="size-1.5 rounded-full bg-current" aria-hidden="true"></span>{r.status}
						</Badge>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
		<Table.Caption>
			{#if selected.length}
				<Ticker value={selected.length} /> selected ·
				<span class="font-medium text-foreground"><Ticker value={total} format={eur} /></span> in total
			{:else}
				Click a row to select it, a column to sort. Example data.
			{/if}
		</Table.Caption>
	</Table.Root>
</div>

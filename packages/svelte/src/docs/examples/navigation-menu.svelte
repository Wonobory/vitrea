<script lang="ts">
	import * as NavigationMenu from "$lib/components/ui/navigation-menu";

	const tools = [
		{ title: "Map", text: "Every live auction in Spain, on one map." },
		{ title: "Alerts", text: "An email when something matches your search." },
		{ title: "How much to bid", text: "Where winning bids usually land." },
		{ title: "Charges", text: "What survives the auction, read from the documents." },
	];
	const resources = [
		{ title: "Guide", text: "How a judicial auction works." },
		{ title: "Blog", text: "What we learn from the data." },
		{ title: "Glossary", text: "Cargas, tasación, depósito…" },
	];
</script>

<div class="flex h-72 items-start justify-center">
	<NavigationMenu.Root>
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-[26rem] gap-1 p-1 sm:grid-cols-2">
						{#each tools as t (t.title)}
							<li>
								<NavigationMenu.Link href="#" class="flex-col items-start gap-1">
									<span class="font-medium">{t.title}</span>
									<span class="text-xs text-muted-foreground">{t.text}</span>
								</NavigationMenu.Link>
							</li>
						{/each}
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-60 gap-1 p-1">
						{#each resources as r (r.title)}
							<li>
								<NavigationMenu.Link href="#" class="flex-col items-start gap-1">
									<span class="font-medium">{r.title}</span>
									<span class="text-xs text-muted-foreground">{r.text}</span>
								</NavigationMenu.Link>
							</li>
						{/each}
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				<NavigationMenu.Link href="#">Pricing</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>

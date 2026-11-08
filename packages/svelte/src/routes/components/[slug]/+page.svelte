<script lang="ts">
	import Segmented from "$lib/components/vitrea/Segmented.svelte";
	import { Button } from "$lib/components/ui/button";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import { NAME } from "$docs/docs";
	import type { Component } from "svelte";

	const examples = import.meta.glob<Component>("/src/docs/examples/*.svelte", {
		import: "default",
		eager: true,
	});

	let { data } = $props();
	let view = $state<"preview" | "code">("preview");
	let copied = $state(false);
	const Example = $derived(examples[`/src/docs/examples/${data.doc.slug}.svelte`]);

	const copy = async () => {
		await navigator.clipboard.writeText(data.code);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	};
</script>

<svelte:head>
	<title>{data.doc.name} · {NAME}</title>
	<meta name="description" content={data.doc.description} />
</svelte:head>

<article class="max-w-3xl">
	<h1 class="font-display text-3xl font-semibold tracking-tight [font-stretch:112%]">
		{data.doc.name}
	</h1>
	<p class="mt-2 text-muted-foreground">{data.doc.description}</p>

	<div class="mt-8 flex items-center justify-between gap-3">
		<Segmented
			options={[
				["preview", "Preview"],
				["code", "Code"],
			]}
			value={view}
			onSelect={(v) => (view = v)}
			label="View"
			controls="panel"
			glass
			compact
			background="var(--background)"
			class="w-48"
		/>
		{#if view === "code"}
			<Button variant="ghost" size="sm" onclick={copy}>
				{#if copied}<CheckIcon /> Copied{:else}<CopyIcon /> Copy{/if}
			</Button>
		{/if}
	</div>

	<div id="panel" class="mt-3">
		{#key data.doc.slug}
			{#if view === "preview"}
				<div
					class="preview grid min-h-80 place-items-center overflow-hidden rounded-xl border p-6 sm:p-10"
				>
					<div class="w-full">
						{#if Example}<Example />{/if}
					</div>
				</div>
			{:else}
				<div
					class="code-block max-h-[32rem] overflow-auto rounded-xl border bg-panel text-[0.8125rem] leading-relaxed"
				>
					{@html data.html}
				</div>
			{/if}
		{/key}
	</div>

	<nav class="mt-12 flex justify-between gap-4 border-t pt-6 text-sm">
		{#if data.prev}
			<Button variant="outline" href="/components/{data.prev.slug}"
				><ArrowLeftIcon /> {data.prev.name}</Button
			>
		{:else}<span></span>{/if}
		{#if data.next}
			<Button variant="outline" href="/components/{data.next.slug}"
				>{data.next.name} <ArrowRightIcon /></Button
			>
		{/if}
	</nav>
</article>

<style>
	.preview {
		background-color: var(--background);
		background-image: radial-gradient(
			color-mix(in oklch, var(--foreground) 12%, transparent) 1px,
			transparent 1px
		);
		background-size: 16px 16px;
	}
	.code-block :global(pre) {
		padding: 1.25rem;
		background: transparent !important;
	}
	.code-block :global(.shiki span) {
		color: var(--shiki-light);
	}
	:global(.dark) .code-block :global(.shiki span) {
		color: var(--shiki-dark);
	}
</style>

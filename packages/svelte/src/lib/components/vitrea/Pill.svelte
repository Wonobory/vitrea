<script lang="ts">
	import CheckIcon from "@lucide/svelte/icons/check";
	import { press } from "$lib/press";

	let {
		on,
		label,
		n,
		onclick,
		hint,
	}: { on: boolean; label: string; n?: number; onclick: () => void; hint?: string } = $props();
</script>

<button
	type="button"
	use:press
	{onclick}
	aria-pressed={on}
	title={hint}
	class={["glass-neutral pill", !on && n === 0 && "zero"]}
>
	<span class="check" aria-hidden="true"><CheckIcon class="size-2.5" strokeWidth={3.5} /></span>
	<span class="truncate">{label}</span>
	{#if n != null}<span class="n">{n.toLocaleString()}</span>{/if}
</button>

<style>
	.pill {
		display: inline-flex;
		min-width: 0;
		align-items: center;
		gap: 0.375rem;
		height: 1.75rem;
		padding: 0 0.625rem;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		color: var(--muted-foreground);
		transition: color 150ms;
	}
	.pill:hover,
	.pill[aria-pressed="true"] {
		color: var(--foreground);
	}
	.pill.zero {
		opacity: 0.45;
	}
	.check {
		display: grid;
		flex: none;
		width: 0.875rem;
		height: 0.875rem;
		margin-left: -0.125rem;
		place-items: center;
		border-radius: 999px;
		color: white;
		box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--muted-foreground) 45%, transparent);
		transition:
			background 150ms,
			box-shadow 150ms;
	}
	.check :global(svg) {
		scale: 0;
		transition: scale 200ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	[aria-pressed="true"] .check {
		background: var(--primary);
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.35);
	}
	[aria-pressed="true"] .check :global(svg) {
		scale: 1;
	}
	.n {
		margin-right: -0.25rem;
		padding: 0.0625rem 0.3125rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		font-variant-numeric: tabular-nums;
		opacity: 0.7;
		transition:
			background 150ms,
			color 150ms;
	}
	[aria-pressed="true"] .n {
		background: var(--primary);
		color: var(--primary-foreground);
		opacity: 1;
	}
</style>

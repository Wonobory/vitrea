<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from "bits-ui";
	import { slide, type TransitionConfig } from "svelte/transition";
	import { MediaQuery } from "svelte/reactivity";
	import { springXSmall } from "$lib/springs";

	let { ref = $bindable(null), children, ...restProps }: CollapsiblePrimitive.ContentProps = $props();

	const reduced = new MediaQuery("prefers-reduced-motion: reduce");

	/**
	 * The accordion's slide (spring in, quick out), and the rows inside follow the
	 * panel down one after another instead of being uncovered all at once. Each
	 * starts a beat after the one before and they all land together at the end.
	 */
	function unfold(node: HTMLElement, { duration, easing }: { duration: number; easing?: (t: number) => number }): TransitionConfig {
		const base = slide(node, { duration: reduced.current ? 0 : duration, easing });
		const rows = [...node.children] as HTMLElement[];
		const step = Math.min(0.12, 0.5 / Math.max(rows.length, 1));
		const span = 1 - step * (rows.length - 1);
		return {
			...base,
			tick: (t) => {
				rows.forEach((row, i) => {
					const k = Math.min(1, Math.max(0, (t - i * step) / span));
					row.style.opacity = k >= 1 ? "" : `${k}`;
					row.style.translate = k >= 1 ? "" : `0 ${(1 - k) * -6}px`;
				});
			},
		};
	}
</script>

<CollapsiblePrimitive.Content bind:ref forceMount data-slot="collapsible-content" {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} in:unfold={{ duration: 420, easing: springXSmall }} out:unfold={{ duration: 180 }}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</CollapsiblePrimitive.Content>

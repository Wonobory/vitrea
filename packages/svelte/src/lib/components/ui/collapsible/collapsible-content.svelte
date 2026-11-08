<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from "bits-ui";
	import { unfold } from "$lib/transitions";
	import { springXSmall } from "$lib/springs";

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: CollapsiblePrimitive.ContentProps = $props();
</script>

<CollapsiblePrimitive.Content bind:ref forceMount data-slot="collapsible-content" {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div
				{...props}
				in:unfold={{ duration: 420, easing: springXSmall }}
				out:unfold={{ duration: 180 }}
			>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</CollapsiblePrimitive.Content>

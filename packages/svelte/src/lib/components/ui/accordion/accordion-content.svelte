<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { slide } from "svelte/transition";
	import { cn, type WithoutChild } from "$lib/utils.js";
	import { springXSmall } from "$lib/springs";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.ContentProps> = $props();
</script>

<AccordionPrimitive.Content bind:ref forceMount data-slot="accordion-content" {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div
				{...props}
				class="overflow-hidden text-sm"
				in:slide={{ duration: 380, easing: springXSmall }}
				out:slide={{ duration: 180 }}
			>
				<div
					class={cn([
						"pt-0 pb-4 text-muted-foreground [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
						className,
					])}
				>
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</AccordionPrimitive.Content>

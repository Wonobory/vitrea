<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import { cn } from "$lib/utils.js";
	import { press } from "$lib/press";
	import { buttonVariants } from "../button/index.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class={cn(["size-4", className])} />
	<span>Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton bind:ref aria-label="Go to previous page" {...restProps}>
	{#snippet child({ props })}
		<button
			{...props}
			use:press
			class={cn([buttonVariants({ variant: "ghost" }), "pl-2!", className])}
		>
			{#if children}
				{@render children?.()}
			{:else}
				{@render Fallback()}
			{/if}
		</button>
	{/snippet}
</PaginationPrimitive.PrevButton>

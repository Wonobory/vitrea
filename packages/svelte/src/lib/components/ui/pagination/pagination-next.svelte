<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { press } from "$lib/press";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: PaginationPrimitive.NextButtonProps = $props();
</script>

<PaginationPrimitive.NextButton bind:ref aria-label="Go to next page" {...restProps}>
	{#snippet child({ props })}
		<button
			{...props}
			use:press
			class={cn([buttonVariants({ variant: "ghost", size: "default" }), "pr-2!", className])}
		>
			<span class="cn-pagination-next-text hidden sm:block">Next</span>
			<ChevronRightIcon data-icon="inline-end" />
		</button>
	{/snippet}
</PaginationPrimitive.NextButton>

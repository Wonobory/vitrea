<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { press } from "$lib/press";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: PaginationPrimitive.PrevButtonProps = $props();
</script>

<PaginationPrimitive.PrevButton
	bind:ref
	aria-label="Go to previous page"
	{...restProps}
>
	{#snippet child({ props })}
		<button {...props} use:press class={cn(
		buttonVariants({ variant: "ghost", size: "default" }),
		"pl-2!",
		className
	)}>
			<ChevronLeftIcon data-icon="inline-start" />
			<span class="cn-pagination-previous-text hidden sm:block">Previous</span>
		</button>
	{/snippet}
</PaginationPrimitive.PrevButton>

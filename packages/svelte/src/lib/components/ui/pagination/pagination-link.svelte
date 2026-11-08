<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { press } from "$lib/press";
	import { buttonVariants, type ButtonSize } from "$lib/components/ui/button/index.js";
	let {
		ref = $bindable(null),
		class: className,
		size = "icon",
		isActive,
		page,
		children,
		...restProps
	}: PaginationPrimitive.PageProps & {
		size?: ButtonSize;
		isActive: boolean;
	} = $props();
</script>

{#snippet Fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	bind:ref
	{page}
	aria-current={isActive ? "page" : undefined}
	data-slot="pagination-link"
	data-active={isActive}
	data-size={size}
	{...restProps}
>
	{#snippet child({ props })}
		<button
			{...props}
			use:press={!isActive}
			class={cn([
				buttonVariants({ size, variant: "ghost" }),
				"relative z-10 tabular-nums text-muted-foreground hover:text-foreground aria-[current=page]:font-semibold aria-[current=page]:text-foreground aria-[current=page]:before:hidden aria-[current=page]:after:hidden",
				className,
			])}
		>
			{#if children}
				{@render children?.()}
			{:else}
				{@render Fallback()}
			{/if}
		</button>
	{/snippet}
</PaginationPrimitive.Page>

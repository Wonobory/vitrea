<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn, type WithoutChild } from "$lib/utils.js";
	import CheckIcon from "@lucide/svelte/icons/check";
	import { scale } from "svelte/transition";
	import { springXSmall } from "$lib/springs";

	let {
		ref = $bindable(null),
		class: className,
		value,
		label,
		children: childrenProp,
		...restProps
	}: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	data-slot="select-item"
	class={cn([
		"relative flex w-full cursor-default items-center gap-2 rounded-lg py-1.5 pr-8 pl-2 text-sm text-muted-foreground outline-hidden transition-colors duration-150 select-none data-highlighted:text-foreground data-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-selected:font-medium [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
		className,
	])}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<span class="absolute end-2 flex size-3.5 items-center justify-center text-primary">
			{#if selected}
				<span in:scale={{ duration: 300, start: 0.3, easing: springXSmall }}
					><CheckIcon class="size-4 stroke-[2.5]" /></span
				>
			{/if}
		</span>
		<span class="flex flex-1 gap-2 shrink-0 whitespace-nowrap">
			{#if childrenProp}
				{@render childrenProp({ selected, highlighted })}
			{:else}
				{label || value}
			{/if}
		</span>
	{/snippet}
</SelectPrimitive.Item>

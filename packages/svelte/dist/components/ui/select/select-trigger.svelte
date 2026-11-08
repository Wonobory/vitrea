<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn, type WithoutChild } from "../../../utils.js";
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { fieldClass } from "../input/field-class";

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = "default",
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> & {
		size?: "sm" | "default";
	} = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	data-slot="select-trigger"
	data-size={size}
	class={cn(
		fieldClass, "flex w-fit items-center justify-between gap-1.5 py-2 pr-2 pl-2.5 text-sm whitespace-nowrap data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 data-[state=open]:border-ring data-[state=open]:bg-card data-[state=open]:shadow-none *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group/select-trigger",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon class="text-muted-foreground size-4 pointer-events-none transition-transform duration-300 ease-[var(--spring-small)] group-data-[state=open]/select-trigger:rotate-180" />
</SelectPrimitive.Trigger>

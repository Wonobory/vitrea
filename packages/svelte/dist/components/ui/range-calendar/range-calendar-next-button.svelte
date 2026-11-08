<script lang="ts">
	import { press } from "../../../press";
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { buttonVariants, type ButtonVariant } from "../button/index.js";
	import { cn } from "../../../utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		variant = "ghost",
		...restProps
	}: RangeCalendarPrimitive.NextButtonProps & {
		variant?: ButtonVariant;
	} = $props();
</script>

{#snippet Fallback()}
	<ChevronRightIcon class={cn("size-4", className)} />
{/snippet}

<!-- With `press`, so the ghost glass shows on hover and press like any Button. -->
<RangeCalendarPrimitive.NextButton bind:ref {...restProps}>
	{#snippet child({ props })}
		<button
			{...props}
			use:press
			class={cn(buttonVariants({ variant }), "size-(--cell-size) p-0 select-none disabled:opacity-50 rtl:rotate-180", className)}
		>
			{#if children}
				{@render children?.()}
			{:else}
				{@render Fallback()}
			{/if}
		</button>
	{/snippet}
</RangeCalendarPrimitive.NextButton>

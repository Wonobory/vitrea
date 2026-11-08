<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from "bits-ui";
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import { scale } from "svelte/transition";
	import { springXSmall } from "$lib/springs";
	import { press } from "$lib/press";

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<!-- Recessed like a field when empty; filled glass (`glass-fill`) when
     ticked, and the tick springs in. Presses like the small glass buttons. -->
<CheckboxPrimitive.Root bind:ref bind:checked bind:indeterminate data-slot="checkbox" {...restProps}>
	{#snippet child({ props, checked, indeterminate })}
		<button
			{...props}
			use:press
			class={cn(
				"peer relative flex size-[1.125rem] shrink-0 items-center justify-center rounded-[5px] border transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50 aria-invalid:border-danger",
				checked || indeterminate
					? "glass-fill"
					: "border-foreground/25 dark:border-input bg-[color-mix(in_oklch,var(--muted)_70%,var(--card))] shadow-[inset_0_1px_2px_rgb(0_0_0/0.08)] hover:border-foreground/40 dark:hover:border-foreground/25 dark:bg-[color-mix(in_oklch,var(--background)_35%,var(--card))] dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)]",
				className
			)}
		>
			<span data-slot="checkbox-indicator" class="grid place-content-center [&>svg]:size-3.5 [&>svg]:stroke-[3]">
				{#if checked}
					<span in:scale={{ duration: 320, start: 0.3, easing: springXSmall }}><CheckIcon /></span>
				{:else if indeterminate}
					<span in:scale={{ duration: 320, start: 0.3, easing: springXSmall }}><MinusIcon /></span>
				{/if}
			</span>
		</button>
	{/snippet}
</CheckboxPrimitive.Root>

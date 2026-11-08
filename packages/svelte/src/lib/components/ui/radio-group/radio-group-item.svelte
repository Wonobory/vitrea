<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import { press } from "$lib/press";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<RadioGroupPrimitive.Item bind:ref data-slot="radio-group-item" {...restProps}>
	{#snippet child({ props, checked })}
		<button
			{...props}
			use:press
			class={cn([
				"group/radio-group-item peer relative flex aspect-square size-[1.125rem] shrink-0 items-center justify-center rounded-full border border-foreground/25 bg-[color-mix(in_oklch,var(--muted)_70%,var(--card))] shadow-[inset_0_1px_2px_rgb(0_0_0/0.08)] transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger dark:border-input dark:bg-[color-mix(in_oklch,var(--background)_35%,var(--card))] dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)] dark:hover:border-foreground/25",
				className,
			])}
		>
			<span
				aria-hidden="true"
				class={cn([
					"glass-fill pointer-events-none absolute -inset-px rounded-full",
					checked
						? "scale-100 opacity-100 transition-[scale,opacity] duration-[420ms,160ms] ease-[var(--spring-small),linear]"
						: "scale-40 opacity-0 transition-[scale,opacity] duration-[180ms] ease-in",
				])}
			></span>
			<span
				data-slot="radio-group-indicator"
				aria-hidden="true"
				class={cn([
					"relative size-1.5 rounded-full bg-white shadow-[0_1px_1px_rgb(0_0_0/0.2)]",
					checked
						? "scale-100 opacity-100 transition-[scale,opacity] delay-[70ms] duration-[380ms,120ms] ease-[var(--spring-xsmall),linear]"
						: "scale-0 opacity-0 transition-[scale,opacity] duration-[140ms] ease-in",
				])}
			></span>
		</button>
	{/snippet}
</RadioGroupPrimitive.Item>

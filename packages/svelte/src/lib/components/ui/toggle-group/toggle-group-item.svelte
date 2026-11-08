<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
	import { getToggleGroupCtx, TINT } from "./toggle-group.svelte";
	import { cn } from "$lib/utils.js";
	import {
		type ToggleVariants,
		toggleVariants,
		glassToggle,
	} from "$lib/components/ui/toggle/index.js";
	import { press } from "$lib/press";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		size,
		variant,
		children,
		...restProps
	}: ToggleGroupPrimitive.ItemProps & ToggleVariants = $props();

	const ctx = getToggleGroupCtx();
	const v = $derived(ctx.variant || variant);
	const single = $derived(ctx.type === "single");
	const inTray = $derived(ctx.spacing === 0);
</script>

<ToggleGroupPrimitive.Item
	bind:ref
	data-slot="toggle-group-item"
	data-variant={v}
	data-size={ctx.size || size}
	data-spacing={ctx.spacing}
	{value}
	{...restProps}
>
	{#snippet child({ props, pressed })}
		{#if single}
			<button
				{...props}
				class={cn([
					toggleVariants({ variant: v, size: ctx.size || size }),
					"relative z-10 shrink-0 data-[state=on]:text-foreground",
					inTray && "h-8",
					className,
				])}
			>
				{@render children?.({ pressed })}
			</button>
		{:else if inTray}
			<button
				{...props}
				class={cn([
					toggleVariants({ variant: v, size: ctx.size || size }),
					"relative z-10 h-8 shrink-0 hover:bg-foreground/[0.04] aria-pressed:text-primary data-[state=on]:text-primary data-[state=on]:hover:bg-transparent",
					className,
				])}
			>
				{@render children?.({ pressed })}
			</button>
		{:else}
			<button
				{...props}
				use:press
				class={cn([
					toggleVariants({ variant: v, size: ctx.size || size }),
					"relative shrink-0",
					pressed ? cn(["glass-neutral aria-pressed:text-primary", TINT]) : glassToggle(v, false),
					className,
				])}
			>
				{@render children?.({ pressed })}
			</button>
		{/if}
	{/snippet}
</ToggleGroupPrimitive.Item>

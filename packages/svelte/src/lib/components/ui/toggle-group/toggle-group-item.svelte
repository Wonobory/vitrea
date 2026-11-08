<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
	import { getToggleGroupCtx } from "./toggle-group.svelte";
	import { TINT } from "$lib/components/ui/button/button.svelte";
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
	const s = $derived(ctx.size || size);
	const look = (pressed: boolean) =>
		single
			? ["relative z-10 shrink-0 data-[state=on]:text-foreground", inTray && "h-8"]
			: inTray
				? "relative z-10 h-8 shrink-0 hover:bg-foreground/[0.04] aria-pressed:text-primary data-[state=on]:text-primary data-[state=on]:hover:bg-transparent"
				: [
						"relative shrink-0",
						pressed ? ["glass-neutral aria-pressed:text-primary", TINT] : glassToggle(v, false),
					];
</script>

<ToggleGroupPrimitive.Item
	bind:ref
	data-slot="toggle-group-item"
	data-variant={v}
	data-size={s}
	data-spacing={ctx.spacing}
	{value}
	{...restProps}
>
	{#snippet child({ props, pressed })}
		<button
			{...props}
			use:press={!single && !inTray}
			class={cn([toggleVariants({ variant: v, size: s }), look(pressed), className])}
		>
			{@render children?.({ pressed })}
		</button>
	{/snippet}
</ToggleGroupPrimitive.Item>

<script lang="ts" module>
	import { createContext } from "svelte";
	import type { VariantProps } from "tailwind-variants";
	import { toggleVariants } from "$lib/components/ui/toggle/index.js";
	import { TINT } from "$lib/components/ui/button/button.svelte";

	type ToggleVariants = VariantProps<typeof toggleVariants>;

	interface ToggleGroupContext extends ToggleVariants {
		spacing?: number;
		type?: "single" | "multiple";
		orientation?: "horizontal" | "vertical";
	}

	export const [getToggleGroupCtx, setToggleGroupCtx] =
		createContext<Required<ToggleGroupContext>>();
</script>

<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { indicator } from "$lib/indicator";
	import { fuse } from "$lib/fuse";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		size = "default",
		spacing = 0,
		orientation = "horizontal",
		variant = "default",
		children,
		...restProps
	}: ToggleGroupPrimitive.RootProps &
		ToggleVariants & {
			spacing?: number;
			orientation?: "horizontal" | "vertical";
		} = $props();

	const rootClass =
		"group/toggle-group relative isolate flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch data-[spacing=0]:gap-0.5 data-[spacing=0]:rounded-lg data-[spacing=0]:bg-muted data-[spacing=0]:p-[3px]";

	setToggleGroupCtx({
		get variant() {
			return variant;
		},
		get size() {
			return size;
		},
		get spacing() {
			return spacing;
		},
		get orientation() {
			return orientation;
		},
		get type() {
			return restProps.type;
		},
	});
</script>

<ToggleGroupPrimitive.Root
	bind:value={value as never}
	bind:ref
	{orientation}
	data-slot="toggle-group"
	data-variant={variant}
	data-size={size}
	data-spacing={spacing}
	{...restProps}
>
	{#snippet child({ props })}
		{#if restProps.type === "single"}
			<div {...props} style:--gap={spacing} class={cn([rootClass, className])} use:indicator>
				{@render children?.()}
			</div>
		{:else if spacing === 0}
			<div
				{...props}
				style:--gap={spacing}
				class={cn([rootClass, className])}
				use:fuse={{
					items: ':scope > [data-slot="toggle-group-item"]',
					on: (el) => el.dataset.state === "on",
					className: cn(["glass-neutral rounded-md", TINT]),
				}}
			>
				{@render children?.()}
			</div>
		{:else}
			<div {...props} style:--gap={spacing} class={cn([rootClass, className])}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</ToggleGroupPrimitive.Root>

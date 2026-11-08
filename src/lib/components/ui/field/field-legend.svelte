<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "legend",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
		variant?: "legend" | "label";
	} = $props();
</script>

<legend
	bind:this={ref}
	data-slot="field-legend"
	data-variant={variant}
	class={cn("mb-3 data-[variant=label]:text-2xs data-[variant=label]:font-semibold data-[variant=label]:tracking-wider data-[variant=label]:text-muted-foreground data-[variant=label]:uppercase data-[variant=legend]:font-display data-[variant=legend]:text-base data-[variant=legend]:font-semibold data-[variant=legend]:[font-stretch:112%]", className)}
	{...restProps}
>
	{@render children?.()}
</legend>

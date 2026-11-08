<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { getEmblaContext } from "./context.js";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import { indicator } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const emblaCtx = getEmblaContext("<Carousel.Dots/>");
</script>

<div
	bind:this={ref}
	data-slot="carousel-dots"
	class={cn(["mt-4 flex items-center justify-center gap-1.5", className])}
	use:indicator={{ active: '[aria-current="true"]', className: "glass-fill rounded-full" }}
	{...restProps}
>
	{#each emblaCtx.scrollSnaps as _, i (i)}
		<button
			type="button"
			class="relative z-10 h-2 rounded-full transition-colors {i === emblaCtx.selectedIndex
				? 'w-5'
				: 'w-2 bg-foreground/20 hover:bg-foreground/40'}"
			aria-label="Go to slide {i + 1}"
			aria-current={i === emblaCtx.selectedIndex ? "true" : undefined}
			onclick={() => emblaCtx.scrollTo(i)}
		></button>
	{/each}
</div>

<script lang="ts">
	import emblaCarouselSvelte from "embla-carousel-svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { getEmblaContext } from "./context.js";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const emblaCtx = getEmblaContext("<Carousel.Content/>");

	type Config = NonNullable<Parameters<typeof emblaCarouselSvelte>[1]>;
	/**
	 * Embla, only once the carousel nears the screen. Mounting it measures its
	 * slides (`offsetTop`) and forces a layout of the whole page: in a list of
	 * 240 cards, unticking a filter mounted 60 carousels and cost 7 s of
	 * back-to-back layouts. Until then the first slide shows, which is what
	 * you'd see anyway without touching it.
	 */
	function emblaWhenVisible(node: HTMLElement, config: Config): ReturnType<typeof emblaCarouselSvelte> {
		let embla: ReturnType<typeof emblaCarouselSvelte> | undefined;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				embla = emblaCarouselSvelte(node, config);
			},
			{ rootMargin: "300px" },
		);
		io.observe(node);
		return {
			update(next: Config) {
				config = next;
				embla?.update?.(next);
			},
			destroy() {
				io.disconnect();
				embla?.destroy?.();
			},
		};
	}
</script>

<!--
	`h-full` on the viewport and the flex container: without it a height set
	from outside never reaches the <img>, `object-contain` has no box to fit
	and the carousel sizes itself by the tallest image. When no ancestor sets a
	height, `height:100%` resolves to `auto` per CSS, so this changes nothing
	in carousels that don't set one.
-->
<div
	data-slot="carousel-content"
	class="h-full overflow-hidden"
	use:emblaWhenVisible={{
		options: {
			container: "[data-embla-container]",
			slides: "[data-embla-slide]",
			...emblaCtx.options,
			axis: emblaCtx.orientation === "horizontal" ? "x" : "y",
		},
		plugins: emblaCtx.plugins,
	}}
	onemblaInit={emblaCtx.onInit}
>
	<div
		bind:this={ref}
		class={cn(
			"flex h-full",
			emblaCtx.orientation === "horizontal" ? "-ms-4" : "-mt-4 flex-col",
			className
		)}
		data-embla-container=""
		{...restProps}
	>
		{@render children?.()}
	</div>
</div>

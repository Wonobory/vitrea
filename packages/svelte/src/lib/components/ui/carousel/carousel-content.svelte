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
	const emblaWhenVisible = (
		node: HTMLElement,
		config: Config
	): ReturnType<typeof emblaCarouselSvelte> => {
		let embla: ReturnType<typeof emblaCarouselSvelte> | undefined;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				embla = emblaCarouselSvelte(node, config);
			},
			{ rootMargin: "300px" }
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
	};
</script>

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
		class={cn([
			"flex h-full",
			emblaCtx.orientation === "horizontal" ? "-ms-4" : "-mt-4 flex-col",
			className,
		])}
		data-embla-container=""
		{...restProps}
	>
		{@render children?.()}
	</div>
</div>

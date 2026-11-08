<script lang="ts">
	import { ScrollArea as ScrollAreaPrimitive } from "bits-ui";
	import { cn, type WithoutChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "vertical",
		children,
		...restProps
	}: WithoutChild<ScrollAreaPrimitive.ScrollbarProps> = $props();
</script>

<!-- An overlay bar like macOS's: a thin capsule hugging the edge that widens
     on a spring when you go for it, with a glass rim. No track. -->
<ScrollAreaPrimitive.Scrollbar
	bind:ref
	data-slot="scroll-area-scrollbar"
	data-orientation={orientation}
	{orientation}
	class={cn(
		"group/scrollbar z-10 flex touch-none p-[3px] select-none data-horizontal:h-3 data-horizontal:flex-col data-vertical:h-full data-vertical:w-3",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ScrollAreaPrimitive.Thumb
		data-slot="scroll-area-thumb"
		class={cn(
			"relative flex-1 rounded-full bg-foreground/30 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3)] transition-[scale,background-color] duration-300 ease-(--spring-small)",
			"group-hover/scrollbar:bg-foreground/45 active:bg-primary",
			orientation === "vertical" ? "origin-right scale-x-50 group-hover/scrollbar:scale-x-100" : "origin-bottom scale-y-50 group-hover/scrollbar:scale-y-100"
		)}
	/>
</ScrollAreaPrimitive.Scrollbar>

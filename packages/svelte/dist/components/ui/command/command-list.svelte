<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "../../../utils.js";
	import { indicator } from "../../../indicator";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: CommandPrimitive.ListProps = $props();

	/** The list's height, eased by the wrapper as you filter. */
	let height = $state<number>();
	function measure(viewport: HTMLElement) {
		const list = viewport.parentElement!;
		const ro = new ResizeObserver(() => (height = list.offsetHeight));
		ro.observe(list);
		ro.observe(viewport);
		return { destroy: () => ro.disconnect() };
	}
</script>

<!-- The selected row is one piece of glass that slides (STYLE.md: lists highlight with one sliding piece
     of glass), and the list eases to its new height as you filter. Both hang off the viewport, and the
     height transition off a wrapper: bits-ui remounts the list when filtering starts and stops, and a
     transition on the list itself was lost on the first keystroke. -->
<div class="overflow-hidden transition-[height] duration-200 ease-out" style:height={height === undefined ? undefined : `${height}px`}>
	<CommandPrimitive.List
		bind:ref
		data-slot="command-list"
		class={cn("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className)}
		{...restProps}
	>
		<CommandPrimitive.Viewport>
			{#snippet child({ props })}
				<div
					{...props}
					use:measure
					use:indicator={{ active: "[data-selected]", attributes: ["data-selected"], curve: "smooth", className: "glass-neutral rounded-md" }}
				>
					{@render children?.()}
				</div>
			{/snippet}
		</CommandPrimitive.Viewport>
	</CommandPrimitive.List>
</div>

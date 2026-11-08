<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { indicator } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: CommandPrimitive.ListProps = $props();

	let height = $state<number>();
	const measure = (viewport: HTMLElement) => {
		const list = viewport.parentElement!;
		const ro = new ResizeObserver(() => (height = list.offsetHeight));
		ro.observe(list);
		ro.observe(viewport);
		return { destroy: () => ro.disconnect() };
	};
</script>

<div
	class="overflow-hidden transition-[height] duration-200 ease-out"
	style:height={height === undefined ? undefined : `${height}px`}
>
	<CommandPrimitive.List
		bind:ref
		data-slot="command-list"
		class={cn([
			"no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
			className,
		])}
		{...restProps}
	>
		<CommandPrimitive.Viewport>
			{#snippet child({ props })}
				<div
					{...props}
					use:measure
					use:indicator={{
						active: "[data-selected]",
						curve: "smooth",
					}}
				>
					{@render children?.()}
				</div>
			{/snippet}
		</CommandPrimitive.Viewport>
	</CommandPrimitive.List>
</div>

<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	import { fade } from "svelte/transition";
	import { floatingIn, fadeScale, FLOATING_OUT } from "$lib/transitions";
	import { indicator } from "$lib/indicator";

	const HIGHLIGHTED = '[data-highlighted], [data-state="open"][data-slot$="sub-trigger"]';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 8,
		alignOffset = -5,
		children,
		...restProps
	}: ContextMenuPrimitive.SubContentProps = $props();
</script>

<ContextMenuPrimitive.Portal>
	<ContextMenuPrimitive.SubContent
		bind:ref
		forceMount
		{sideOffset}
		{alignOffset}
		data-slot="context-menu-sub-content"
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn([
							"glass-panel z-50 min-w-36 origin-(--bits-floating-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl p-1 text-popover-foreground outline-none",
							className,
						])}
						use:indicator={{
							active: HIGHLIGHTED,
							attributes: ["data-highlighted"],
							curve: "smooth",
							className: "glass-neutral rounded-md",
						}}
						in:fadeScale={floatingIn}
						out:fade={{ duration: FLOATING_OUT }}
					>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</ContextMenuPrimitive.SubContent>
</ContextMenuPrimitive.Portal>

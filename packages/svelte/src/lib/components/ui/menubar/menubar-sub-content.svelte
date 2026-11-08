<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	import { fade } from "svelte/transition";
	import { floatingIn, fadeScale, FLOATING_OUT } from "$lib/transitions";
	import { indicator, menuHighlight } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 8,
		alignOffset = -5,
		children,
		...restProps
	}: MenubarPrimitive.SubContentProps = $props();
</script>

<MenubarPrimitive.Portal>
	<MenubarPrimitive.SubContent
		bind:ref
		forceMount
		{sideOffset}
		{alignOffset}
		data-slot="menubar-sub-content"
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
						use:indicator={menuHighlight}
						in:fadeScale={floatingIn}
						out:fade={{ duration: FLOATING_OUT }}
					>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</MenubarPrimitive.SubContent>
</MenubarPrimitive.Portal>

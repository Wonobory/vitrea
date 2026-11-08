<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "../../../utils.js";

	import { fade } from "svelte/transition";
	import { floatingIn, fadeScale, FLOATING_OUT } from "../../../transitions";
	import { indicator } from "../../../indicator";

	// The highlighted row, or the sub-menu trigger whose sub-menu is open.
	const HIGHLIGHTED = '[data-highlighted], [data-state="open"][data-slot$="sub-trigger"]';

	let {
		ref = $bindable(null),
		class: className,
		// A clear gap from the parent sheet, with its first row level with the trigger (p-1 + rim).
		sideOffset = 8,
		alignOffset = -5,
		children,
		...restProps
	}: MenubarPrimitive.SubContentProps = $props();
</script>

<!-- Glass sheet that grows from where it opened (see popover-content). -->

<MenubarPrimitive.Portal>
	<MenubarPrimitive.SubContent bind:ref forceMount {sideOffset} {alignOffset} data-slot="menubar-sub-content" {...restProps}>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn(
							"glass-panel z-50 min-w-36 origin-(--bits-floating-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl p-1 text-popover-foreground outline-none",
							className
						)}
						use:indicator={{ active: HIGHLIGHTED, attributes: ["data-highlighted"], curve: "smooth", className: "glass-neutral rounded-md" }}
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


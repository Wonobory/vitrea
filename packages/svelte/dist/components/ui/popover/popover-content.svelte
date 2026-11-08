<script lang="ts">
	import { Popover as PopoverPrimitive } from "bits-ui";
	import PopoverPortal from "./popover-portal.svelte";
	import { cn, type WithoutChildrenOrChild } from "../../../utils.js";
	import type { ComponentProps } from "svelte";
	import { fade } from "svelte/transition";
	import { floatingIn, fadeScale, FLOATING_OUT } from "../../../transitions";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 6,
		align = "center",
		portalProps,
		children,
		...restProps
	}: PopoverPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>;
	} = $props();
</script>

<!-- Glass sheet (`glass-panel`) that grows from its trigger with the modal spring. -->
<PopoverPortal {...portalProps}>
	<PopoverPrimitive.Content bind:ref forceMount data-slot="popover-content" {sideOffset} {align} {...restProps}>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						class={cn(
							"glass-panel z-50 flex w-72 origin-(--bits-floating-transform-origin) flex-col gap-4 rounded-xl p-4 text-sm text-popover-foreground outline-hidden",
							className
						)}
						in:fadeScale={floatingIn}
						out:fade={{ duration: FLOATING_OUT }}
					>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</PopoverPrimitive.Content>
</PopoverPortal>

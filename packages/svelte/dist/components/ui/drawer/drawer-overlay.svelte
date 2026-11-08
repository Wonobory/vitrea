<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { cn } from "../../../utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DrawerPrimitive.OverlayProps = $props();
</script>

<!-- No animation of our own: vaul's CSS (unlayered) beats the utilities on
     animation name and duration, and with our `reverse` its fadeOut ran from 0
     to 1: on close the blur went, came back and went again. Vaul's fade is enough. -->
<DrawerPrimitive.Overlay
	bind:ref
	data-slot="drawer-overlay"
	class={cn("backdrop-blur-[10px] fixed inset-0 z-50", className)}
	{...restProps}
/>

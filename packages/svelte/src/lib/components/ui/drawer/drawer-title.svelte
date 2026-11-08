<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DrawerPrimitive.TitleProps = $props();
</script>

<DrawerPrimitive.Title
	bind:ref
	data-slot="drawer-title"
	class={cn([
		"text-foreground font-display text-lg leading-tight font-semibold tracking-tight [font-stretch:112%]",
		className,
	])}
	{...restProps}
/>

<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "../../../utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.LinkProps = $props();
</script>

<NavigationMenuPrimitive.Link
	bind:ref
	data-slot="navigation-menu-link"
	class={cn(
		// In the bar it looks like a trigger (muted until hovered or current); inside a menu, a row.
		// Hover and focus are the glass indicator of the bar or the menu, not a background here.
		"relative z-10 flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground data-active:text-foreground [&_svg:not([class*='size-'])]:size-4",
		"in-data-[slot=navigation-menu-content]:h-auto in-data-[slot=navigation-menu-content]:rounded-lg in-data-[slot=navigation-menu-content]:p-2.5 in-data-[slot=navigation-menu-content]:font-normal in-data-[slot=navigation-menu-content]:text-foreground in-data-[slot=navigation-menu-content]:data-active:bg-foreground/7",
		className
	)}
	{...restProps}
/>

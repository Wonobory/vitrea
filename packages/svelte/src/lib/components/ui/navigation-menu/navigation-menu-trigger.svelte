<script lang="ts" module>
	import { cn } from "$lib/utils.js";
	import { tv } from "tailwind-variants";

	export const navigationMenuTriggerStyle = tv({
		base: "relative z-10 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center outline-none disabled:pointer-events-none",
	});
</script>

<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.TriggerProps = $props();
</script>

<NavigationMenuPrimitive.Trigger
	bind:ref
	data-slot="navigation-menu-trigger"
	class={cn([navigationMenuTriggerStyle(), "group", className])}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon
		class="relative top-px ml-1 size-3 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:rotate-180"
		aria-hidden="true"
	/>
</NavigationMenuPrimitive.Trigger>

<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "../../../utils.js";
	import { indicator } from "../../../indicator";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.ListProps = $props();

	const ACTIVE = '[data-state="open"], :scope > li > :hover, :scope > li > :focus-visible';
</script>

<!-- One glass indicator for the bar: on the open trigger, else on the item under the pointer or
     with keyboard focus. Links and triggers share it, so it slides from one to the other. -->
<NavigationMenuPrimitive.List bind:ref data-slot="navigation-menu-list" {...restProps}>
	{#snippet child({ props, wrapperProps })}
		<div {...wrapperProps}>
			<ul
				{...props}
				class={cn("group isolate flex flex-1 list-none items-center justify-center gap-1", className)}
				use:indicator={{ active: ACTIVE, className: "glass-neutral rounded-md" }}
			>
				{@render children?.()}
			</ul>
		</div>
	{/snippet}
</NavigationMenuPrimitive.List>

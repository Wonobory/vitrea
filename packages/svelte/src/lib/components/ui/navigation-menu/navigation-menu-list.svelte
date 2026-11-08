<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { indicator } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.ListProps = $props();

	const ACTIVE = '[data-state="open"], :scope > li > :hover, :scope > li > :focus-visible';
</script>

<NavigationMenuPrimitive.List bind:ref data-slot="navigation-menu-list" {...restProps}>
	{#snippet child({ props, wrapperProps })}
		<div {...wrapperProps}>
			<ul
				{...props}
				class={cn([
					"group isolate flex flex-1 list-none items-center justify-center gap-1",
					className,
				])}
				use:indicator={{ active: ACTIVE }}
			>
				{@render children?.()}
			</ul>
		</div>
	{/snippet}
</NavigationMenuPrimitive.List>

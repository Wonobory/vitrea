<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "../../../utils.js";
	import { indicator } from "../../../indicator";

	// The row under the pointer or with keyboard focus, in the menu that is open (not the one leaving).
	const ROW = '[data-state="open"] [data-slot="navigation-menu-link"]:is(:hover, :focus-visible)';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.ViewportProps = $props();
</script>

<!-- Under the open trigger (`--nav-left`, set by the root) and kept on screen with a 1rem gutter:
     `--nav-root` is where the root starts on screen, and the sheet is its content plus 1rem. -->
<div class="absolute start-0 top-full isolate z-50">
	<NavigationMenuPrimitive.Viewport bind:ref data-slot="navigation-menu-viewport" {...restProps}>
		{#snippet child({ props })}
			<div
				{...props}
				class={cn(
					"glass-panel text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:fade-in-0 data-open:zoom-in-95 rounded-xl transition-[width,height,left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top-left relative mt-2 h-[calc(var(--bits-navigation-menu-viewport-height)+1rem)] w-[calc(var(--bits-navigation-menu-viewport-width)+1rem)] overflow-hidden",
					"left-[clamp(calc(1rem_-_var(--nav-root,0px)),var(--nav-left,0px),calc(var(--nav-screen,100vw)_-_2rem_-_var(--nav-root,0px)_-_var(--bits-navigation-menu-viewport-width,0px)))]",
					className
				)}
				use:indicator={{ active: ROW, curve: "smooth", className: "glass-neutral rounded-lg" }}
			></div>
		{/snippet}
	</NavigationMenuPrimitive.Viewport>
</div>

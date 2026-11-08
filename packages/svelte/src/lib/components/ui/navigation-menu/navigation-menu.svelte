<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import NavigationMenuViewport from "./navigation-menu-viewport.svelte";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		viewport = true,
		children,
		...restProps
	}: NavigationMenuPrimitive.RootProps & {
		viewport?: boolean;
	} = $props();

	// Where the open trigger starts, for the viewport to open under it. By `data-value`, which is
	// there before the trigger turns open: set in the same frame the sheet appears, it doesn't slide
	// in from the last trigger. Switching menus, it does slide.
	$effect(() => {
		if (!ref || !value) return;
		const trigger = ref.querySelector<HTMLElement>(`[data-slot="navigation-menu-trigger"][data-value="${CSS.escape(value)}"]`);
		if (!trigger) return;
		const root = ref.getBoundingClientRect();
		ref.style.setProperty("--nav-left", `${trigger.getBoundingClientRect().left - root.left}px`);
		ref.style.setProperty("--nav-root", `${root.left}px`);
		// The page width without a classic scrollbar, which 100vw counts.
		ref.style.setProperty("--nav-screen", `${document.documentElement.clientWidth}px`);
	});
</script>

<NavigationMenuPrimitive.Root
	bind:ref
	bind:value
	data-slot="navigation-menu"
	data-viewport={viewport}
	class={cn("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", className)}
	{...restProps}
>
	{@render children?.()}
	{#if viewport}
		<NavigationMenuViewport />
	{/if}
</NavigationMenuPrimitive.Root>

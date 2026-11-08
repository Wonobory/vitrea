<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { indicator } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: MenubarPrimitive.RootProps = $props();
</script>

<MenubarPrimitive.Root bind:ref data-slot="menubar" {...restProps}>
	{#snippet child({ props })}
		<div
			{...props}
			class={cn(["glass-panel isolate flex h-10 items-center gap-1 rounded-lg p-1", className])}
			use:indicator={{ active: '[data-state="open"]' }}
		>
			{@render children?.()}
		</div>
	{/snippet}
</MenubarPrimitive.Root>

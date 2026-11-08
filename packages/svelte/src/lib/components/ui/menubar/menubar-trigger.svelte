<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: MenubarPrimitive.TriggerProps = $props();
</script>

<MenubarPrimitive.Trigger
	bind:ref
	data-slot="menubar-trigger"
	class={cn([
		"relative z-10 flex h-full items-center rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors outline-hidden select-none hover:text-foreground data-[state=open]:text-foreground",
		className,
	])}
	{...restProps}
/>

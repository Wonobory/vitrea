<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "../../../utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SheetPrimitive.OverlayProps = $props();
</script>

<SheetPrimitive.Overlay
	bind:ref
	data-slot="sheet-overlay"
	class={cn("data-open:animate-backdrop-in data-closed:animate-backdrop-out backdrop-blur-[10px] fixed inset-0 z-50", className)}
	{...restProps}
/>

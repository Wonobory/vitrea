<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from "../../../utils.js";
	import { fieldClass } from "../input/field-class";
	import type { HTMLTextareaAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		"data-slot": dataSlot = "textarea",
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		fieldClass, "flex field-sizing-content min-h-16 w-full px-2.5 py-2 text-base md:text-sm",
		className
	)}
	bind:value
	{...restProps}
></textarea>

<script lang="ts">
	import { cn, type WithElementRef } from "../../../utils.js";
	import type { HTMLSelectAttributes } from "svelte/elements";
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { fieldClass } from "../input/field-class";

	type NativeSelectProps = Omit<WithElementRef<HTMLSelectAttributes>, "size"> & {
		size?: "sm" | "default";
	};

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		size = "default",
		children,
		...restProps
	}: NativeSelectProps = $props();
</script>

<div
	class={cn(
		"cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50",
		className
	)}
	data-slot="native-select-wrapper"
	data-size={size}
>
	<select
		bind:value
		bind:this={ref}
		data-slot="native-select"
		data-size={size}
		class={cn(fieldClass, "h-9 w-full min-w-0 appearance-none py-1 pr-8 pl-2.5 text-sm select-none data-[size=sm]:h-8 disabled:pointer-events-none")}
		{...restProps}
	>
		{@render children?.()}
	</select>
	<ChevronDownIcon class="text-muted-foreground transition-colors group-hover/native-select:text-foreground top-1/2 right-2.5 size-4 -translate-y-1/2 pointer-events-none absolute select-none" aria-hidden data-slot="native-select-icon" />
</div>

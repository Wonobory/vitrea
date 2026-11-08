<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	data-slot="avatar-fallback"
	class={cn([
		"bg-[color-mix(in_oklch,var(--primary)_14%,var(--card))] text-primary font-medium rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs",
		className,
	])}
	{...restProps}
/>

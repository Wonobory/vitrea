<script lang="ts">
	import { cn } from "$lib/utils.js";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import type { SVGAttributes } from "svelte/elements";

	let {
		class: className,
		role = "status",
		"aria-label": ariaLabel = "Loading",
		...restProps
	}: SVGAttributes<SVGSVGElement> = $props();
</script>

<Loader2Icon
	{role}
	aria-label={ariaLabel}
	class={cn(["size-4 animate-spin", className])}
	{...restProps as Record<string, unknown>}
/>

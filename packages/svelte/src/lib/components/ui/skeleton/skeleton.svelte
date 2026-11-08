<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="skeleton"
	class={cn(["skeleton relative overflow-hidden rounded-md bg-foreground/8", className])}
	{...restProps}
></div>

<style>
	.skeleton::after {
		content: "";
		position: absolute;
		inset: 0;
		translate: -100% 0;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in oklch, var(--foreground) 7%, transparent),
			transparent
		);
		animation: skeleton-sweep 1.6s ease-in-out infinite;
	}
	@keyframes skeleton-sweep {
		to {
			translate: 100% 0;
		}
	}
</style>

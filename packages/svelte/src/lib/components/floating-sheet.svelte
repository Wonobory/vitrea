<script lang="ts">
	import type { Snippet } from "svelte";
	import { fade } from "svelte/transition";
	import { cn } from "$lib/utils.js";
	import { indicator, menuHighlight } from "$lib/indicator";
	import { fadeScale, floatingIn, FLOATING_OUT, type FadeScaleParams } from "$lib/transitions";

	let {
		wrapperProps,
		props,
		open,
		class: className,
		menu = false,
		enter = floatingIn,
		children,
	}: {
		wrapperProps: Record<string, unknown>;
		props: Record<string, unknown>;
		open: boolean;
		class?: string;
		menu?: boolean;
		enter?: FadeScaleParams;
		children: Snippet;
	} = $props();

	const base = "glass-panel z-50 origin-(--bits-floating-transform-origin) rounded-xl";
	const menuClass = "overflow-x-hidden overflow-y-auto p-1 text-popover-foreground outline-none";
</script>

{#if menu}
	{#if open}
		<div {...wrapperProps}>
			<div
				{...props}
				class={cn([base, menuClass, className])}
				use:indicator={menuHighlight}
				in:fadeScale={enter}
				out:fade={{ duration: FLOATING_OUT }}
			>
				{@render children()}
			</div>
		</div>
	{/if}
{:else if open}
	<div {...wrapperProps}>
		<div
			{...props}
			class={cn([base, className])}
			in:fadeScale={enter}
			out:fade={{ duration: FLOATING_OUT }}
		>
			{@render children()}
		</div>
	</div>
{/if}

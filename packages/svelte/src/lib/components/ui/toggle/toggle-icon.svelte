<script lang="ts">
	import type { Component } from "svelte";
	import { cn } from "$lib/utils.js";

	let { pressed, icon: IconComponent }: { pressed: boolean; icon: Component<{ class?: string }> } =
		$props();

	let beat = $state(0);
	let wasPressed: boolean | undefined;
	$effect.pre(() => {
		if (wasPressed === false && pressed) beat++;
		wasPressed = pressed;
	});
</script>

<span class="relative grid size-4 shrink-0 place-items-center">
	{#key beat}
		<IconComponent
			class={cn([
				"size-4 transition-colors",
				pressed && "fill-current text-primary",
				beat && "beating",
			])}
		/>
		{#if beat && pressed}
			<span class="ring" aria-hidden="true"></span>
			{#each [0, 60, 120, 180, 240, 300] as a (a)}
				<span class="spark" style:--a="{a}deg" aria-hidden="true"></span>
			{/each}
		{/if}
	{/key}
</span>

<style>
	:global(.beating) {
		animation: beat 480ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes beat {
		0% {
			scale: 0.6;
		}
		40% {
			scale: 1.3;
		}
		100% {
			scale: 1;
		}
	}
	.ring {
		position: absolute;
		inset: -4px;
		border-radius: 999px;
		border: 2px solid var(--primary);
		opacity: 0;
		pointer-events: none;
		animation: ring 560ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes ring {
		0% {
			scale: 0.4;
			opacity: 1;
		}
		100% {
			scale: 1.9;
			opacity: 0;
		}
	}
	.spark {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 4px;
		height: 4px;
		margin: -2px;
		border-radius: 999px;
		background: var(--primary);
		opacity: 0;
		pointer-events: none;
		animation: spark 620ms cubic-bezier(0.22, 1, 0.36, 1) 80ms;
	}
	@keyframes spark {
		0% {
			transform: rotate(var(--a)) translateY(-7px) scale(1);
			opacity: 1;
		}
		100% {
			transform: rotate(var(--a)) translateY(-20px) scale(0.3);
			opacity: 0;
		}
	}
</style>

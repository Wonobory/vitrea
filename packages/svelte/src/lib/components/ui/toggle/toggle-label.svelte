<script lang="ts">
	let { pressed, on, off }: { pressed: boolean; on: string; off: string } = $props();

	let offWidth = $state(0);
	let onWidth = $state(0);
	const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
</script>

<span
	class="inline-grid overflow-hidden align-bottom transition-[width] duration-300 {ease}"
	style:width={offWidth && onWidth ? `${pressed ? onWidth : offWidth}px` : null}
>
	<span
		bind:clientWidth={offWidth}
		aria-hidden={pressed}
		class={[
			"col-start-1 row-start-1 justify-self-start whitespace-nowrap transition-[opacity,translate]",
			ease,
			pressed ? "-translate-y-2 opacity-0 duration-150" : "duration-300 delay-100",
		]}>{off}</span
	>
	<span
		bind:clientWidth={onWidth}
		aria-hidden={!pressed}
		class={[
			"col-start-1 row-start-1 justify-self-start whitespace-nowrap transition-[opacity,translate]",
			ease,
			pressed ? "duration-300 delay-100" : "translate-y-2 opacity-0 duration-150",
		]}>{on}</span
	>
</span>

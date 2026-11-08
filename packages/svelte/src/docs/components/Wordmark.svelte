<script lang="ts">
	let { class: className }: { class?: string } = $props();
</script>

<span
	class={["font-display font-semibold tracking-tight [font-stretch:112%]", className]}
	aria-label="Vitrea"
	role="img"
>
	<span aria-hidden="true"
		>v<span class="relative inline-block">ı<span class="bead absolute"></span></span>trea</span
	>
</span>

<style>
	.bead {
		left: 54%;
		top: 0.08em;
		width: 0.32em;
		height: 0.32em;
		translate: -50% 0;
		border-radius: 50%;
		background:
			radial-gradient(circle at 34% 30%, rgb(255 255 255 / 0.75) 0 16%, transparent 18%),
			linear-gradient(
				color-mix(in oklch, var(--primary) 70%, white),
				color-mix(in oklch, var(--primary) 80%, black)
			);
		box-shadow: 0 0.04em 0.08em color-mix(in oklch, var(--primary) 40%, transparent);
	}
</style>

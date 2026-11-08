<script lang="ts">
	import { Tooltip } from "bits-ui";
</script>

<Tooltip.Arrow>
	{#snippet child({ props })}
		<span
			{...props}
			class="pointer-events-none block h-[7px] w-[14px] [clip-path:inset(-1px_0_0_0)]"
			aria-hidden="true"
		>
			<span class="tip"></span>
		</span>
	{/snippet}
</Tooltip.Arrow>

<style>
	.tip {
		position: absolute;
		left: 2px;
		top: -6px;
		width: 10px;
		height: 10px;
		rotate: 45deg;
		border-radius: 0 0 2px 0;
		background: linear-gradient(var(--glass-veil), var(--glass-veil)), var(--card);
		border-right: 1px solid rgb(0 0 0 / 0.08);
		border-bottom: 1px solid rgb(0 0 0 / 0.08);
		box-shadow: 1px 1px 2px rgb(0 0 0 / 0.1);
	}
	:global(.dark) .tip {
		border-color: rgb(255 255 255 / 0.1);
		box-shadow: 1px 1px 2px rgb(0 0 0 / 0.35);
	}
</style>

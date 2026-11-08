<script lang="ts">
	import { PinInput as InputOTPPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { indicator } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		status = "idle",
		children: content,
		...restProps
	}: InputOTPPrimitive.RootProps & {
		/**
		 * What happened to the code once complete: `verifying` runs a wave
		 * along the slots, `success` turns them green one after another,
		 * `error` shakes the field in red. The slots read it from the root.
		 */
		status?: "idle" | "verifying" | "success" | "error";
	} = $props();

	// Slot order for the staggered waves (`--i`), across groups and separators.
	function numberSlots(node: HTMLElement) {
		const apply = () => node.querySelectorAll<HTMLElement>("[data-slot=input-otp-slot]").forEach((s, i) => s.style.setProperty("--i", String(i)));
		apply();
		const mo = new MutationObserver(apply);
		mo.observe(node, { childList: true, subtree: true });
		return { destroy: () => mo.disconnect() };
	}
</script>

<!-- One focus frame slides from slot to slot as you type (`$lib/indicator`),
     instead of each slot lighting its own ring. It sits above the slots.
     Status and shake live on our own wrapper: bits-ui puts the root's props on
     its hidden <input>, which isn't an ancestor of the slots. -->
<div
	data-slot="input-otp"
	data-status={status}
	class={cn("group/otp inline-flex has-disabled:opacity-50 data-[status=error]:animate-[otp-shake_420ms_cubic-bezier(0.36,0.07,0.19,0.97)]", className)}
>
	<InputOTPPrimitive.Root bind:ref bind:value spellcheck={false} class="disabled:cursor-not-allowed" {...restProps}>
		{#snippet children(props)}
			<div
				class="relative flex items-center gap-2"
				use:numberSlots
				use:indicator={{
					active: "[data-active]",
					attributes: ["data-active"],
					className: "!z-20 rounded-lg border border-ring ring-3 ring-ring/20 group-data-[status=verifying]/otp:invisible group-data-[status=success]/otp:invisible group-data-[status=error]/otp:invisible",
				}}
			>
				{@render content?.(props)}
			</div>
		{/snippet}
	</InputOTPPrimitive.Root>
</div>

<style>
	@keyframes -global-otp-shake {
		10%, 90% { translate: -1px 0; }
		20%, 80% { translate: 3px 0; }
		30%, 50%, 70% { translate: -6px 0; }
		40%, 60% { translate: 6px 0; }
	}
</style>

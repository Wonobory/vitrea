<script lang="ts" module>
	export const TAP = Symbol("tooltip-tap");
</script>

<script lang="ts" generics="T = never">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { setContext } from "svelte";

	let {
		open = $bindable(false),
		openOnTap = false,
		...restProps
	}: TooltipPrimitive.RootProps<T> & {
		/** Touch screens: a tap on the trigger toggles it. Leave off if the trigger runs an action. */
		openOnTap?: boolean;
	} = $props();

	setContext(TAP, () => {
		if (!openOnTap) return;
		const was = open;
		setTimeout(() => (open = !was));
	});
</script>

<TooltipPrimitive.Root bind:open {...restProps} />

<script lang="ts" module>
	import { createContext } from "svelte";

	export const [getTap, setTap] = createContext<() => void>();
</script>

<script lang="ts" generics="T = never">
	import { Tooltip as TooltipPrimitive } from "bits-ui";

	let {
		open = $bindable(false),
		openOnTap = false,
		...restProps
	}: TooltipPrimitive.RootProps<T> & {
		/** Touch screens: a tap on the trigger toggles it. Leave off if the trigger runs an action. */
		openOnTap?: boolean;
	} = $props();

	setTap(() => {
		if (!openOnTap) return;
		const was = open;
		setTimeout(() => (open = !was));
	});
</script>

<TooltipPrimitive.Root bind:open {...restProps} />

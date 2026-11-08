<script lang="ts">
	import { Label } from "$lib/components/ui/label/index.js";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof Label> = $props();
</script>

<Label
	bind:ref
	data-slot="field-label"
	class={cn([
		"transition-colors has-[>[data-slot=field]]:bg-panel hover:has-[>[data-slot=field]]:border-foreground/20 has-data-checked:border-primary/40 has-data-checked:bg-primary/[0.06] dark:has-data-checked:border-primary/30 dark:has-data-checked:bg-primary/10 gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-xl has-[>[data-slot=field]]:border *:data-[slot=field]:p-3 group/field-label peer/field-label flex w-fit leading-snug",
		"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
		className,
	])}
	{...restProps}
>
	{@render children?.()}
</Label>

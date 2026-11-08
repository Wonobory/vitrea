<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const buttonGroupVariants = tv({
		base: [
			"glass-panel relative isolate flex w-fit items-stretch gap-0.5 rounded-lg p-0.5 has-[>[data-slot=button-group]]:gap-2",
			"[&>[data-slot=button]]:bg-none [&>[data-slot=button]]:bg-transparent [&>[data-slot=button]]:shadow-none [&>[data-slot=button]]:before:hidden [&>[data-slot=button]]:after:hidden [&>[data-slot=button]]:rounded-md",
			"[&>[data-slot=button]]:text-muted-foreground [&>[data-slot=button][data-highlighted]]:text-foreground [&>[data-slot=button]]:transition-colors",
			"[&>*]:focus-visible:relative [&>*]:focus-visible:z-10 [&>input]:flex-1",
		],
		variants: {
			orientation: {
				horizontal: "",
				vertical: "flex-col",
			},
		},
		defaultVariants: {
			orientation: "horizontal",
		},
	});

	export type ButtonGroupOrientation = VariantProps<typeof buttonGroupVariants>["orientation"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { indicator } from "$lib/indicator";

	let {
		ref = $bindable(null),
		class: className,
		children,
		orientation = "horizontal",
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		orientation?: ButtonGroupOrientation;
	} = $props();

	let current: HTMLElement | null = null;
	const mark = (b: HTMLElement | null) => {
		if (b === current) return;
		current?.removeAttribute("data-highlighted");
		b?.setAttribute("data-highlighted", "");
		current = b;
	};
	const onOver = (e: PointerEvent) => {
		if (e.pointerType === "touch") return;
		const b = (e.target as HTMLElement).closest<HTMLElement>("[data-slot=button]");
		mark(b && b.parentElement === ref && !b.matches(":disabled") ? b : null);
	};
</script>

<div
	bind:this={ref}
	role="group"
	data-slot="button-group"
	data-orientation={orientation}
	class={cn([buttonGroupVariants({ orientation }), className])}
	onpointerover={onOver}
	onpointerleave={() => mark(null)}
	use:indicator={{
		active: ":scope > [data-highlighted]",
		curve: "smooth",
	}}
	{...restProps}
>
	{@render children?.()}
</div>

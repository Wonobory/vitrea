<script lang="ts">
	import { reducedMotion } from "$lib/transitions";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props();

	import { onMount } from "svelte";

	let current: HTMLElement | null = null;
	const mark = (row: HTMLElement | null) => {
		if (row === current) return;
		current?.removeAttribute("data-highlighted");
		row?.setAttribute("data-highlighted", "");
		current = row;
	};

	onMount(() => {
		const body = ref!;
		const rows = () => [...body.children] as HTMLElement[];
		const curve =
			getComputedStyle(document.documentElement).getPropertyValue("--spring-small").trim() ||
			"ease-out";
		let before = new Map<HTMLElement, number>();
		const measure = () => (before = new Map(rows().map((r) => [r, r.offsetTop])));
		measure();
		const mo = new MutationObserver(() => {
			const now = new Map<HTMLElement, number>();
			const animate = !reducedMotion.current;
			for (const r of rows()) {
				const top = r.offsetTop;
				now.set(r, top);
				const d = (before.get(r) ?? top) - top;
				if (d && animate)
					r.animate([{ translate: `0 ${d}px` }, { translate: "0 0" }], {
						duration: 500,
						easing: curve,
					});
			}
			before = now;
		});
		mo.observe(body, { childList: true });
		const ro = new ResizeObserver(measure);
		ro.observe(body);
		return () => (mo.disconnect(), ro.disconnect());
	});
</script>

<tbody
	bind:this={ref}
	data-slot="table-body"
	class={cn(["[&_tr:last-child]:border-0", className])}
	onpointerover={(e) =>
		e.pointerType !== "touch" && mark((e.target as HTMLElement).closest("tr[data-clickable]"))}
	onpointerleave={() => mark(null)}
	{...restProps}
>
	{@render children?.()}
</tbody>

<script lang="ts">
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
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		const rows = () => [...body.children] as HTMLElement[];
		let before = new Map(rows().map((r) => [r, r.offsetTop]));
		const measure = () => (before = new Map(rows().map((r) => [r, r.offsetTop])));
		const mo = new MutationObserver(() => {
			const curve =
				getComputedStyle(document.documentElement).getPropertyValue("--spring-small").trim() ||
				"ease-out";
			for (const r of rows()) {
				const d = (before.get(r) ?? r.offsetTop) - r.offsetTop;
				if (d && !reduced.matches)
					r.animate([{ translate: `0 ${d}px` }, { translate: "0 0" }], {
						duration: 500,
						easing: curve,
					});
			}
			measure();
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

import { offsetWithin } from "$lib/utils";
import { reducedMotion } from "$lib/transitions";
/** `use:fuse={{ items, on, className }}` on the container: consecutive items that are on share one piece of glass. Items must paint above it (`relative z-10`). */
export type FuseOptions = {
	/** Selector of the items, relative to the container. */
	items: string;
	/** Whether an item is part of the selection. */
	on: (el: HTMLElement) => boolean;
	/** Classes for each piece. */
	className: string;
	/** Runs never cross a change of row (e.g. `el => el.closest("tr")`). */
	row?: (el: HTMLElement) => unknown;
	/** Attributes whose change means the selection changed. */
	watch?: string[];
};

type Run = { el: HTMLSpanElement; a: number; b: number };

export const fuse = (node: HTMLElement, options: FuseOptions) => {
	let o = options;
	if (getComputedStyle(node).position === "static") node.style.position = "relative";
	let runs: Run[] = [];

	type Box = { x: number; y: number; w: number; h: number };
	const boxOf = (first: HTMLElement, last: HTMLElement): Box => {
		const p = offsetWithin(first, node);
		const q = offsetWithin(last, node);
		return { x: p.x, y: p.y, w: q.x + last.offsetWidth - p.x, h: q.y + last.offsetHeight - p.y };
	};
	const place = (el: HTMLElement, b: Box, animate: boolean) => {
		const curve = "300ms var(--spring-small)";
		el.style.transition =
			animate && !reducedMotion.current
				? `translate ${curve}, width ${curve}, height ${curve}`
				: "none";
		el.style.translate = `${b.x}px ${b.y}px`;
		el.style.width = `${b.w}px`;
		el.style.height = `${b.h}px`;
	};

	const measure = (animate: boolean) => {
		const items = [...node.querySelectorAll<HTMLElement>(o.items)];
		const spans: [number, number][] = [];
		items.forEach((el, i) => {
			if (!o.on(el)) return;
			const last = spans.at(-1);
			if (last && last[1] === i - 1 && (!o.row || o.row(items[i - 1]!) === o.row(el))) last[1] = i;
			else spans.push([i, i]);
		});

		const boxes = spans.map(([a, b]) => boxOf(items[a]!, items[b]!));
		const next: Run[] = [];
		for (const [i, [a, b]] of spans.entries()) {
			let run = runs.find((r) => !next.includes(r) && r.a <= b && a <= r.b);
			if (run) {
				run.a = a;
				run.b = b;
				place(run.el, boxes[i]!, animate);
			} else {
				const el = document.createElement("span");
				el.dataset.fuse = "";
				el.setAttribute("aria-hidden", "true");
				el.className = `pointer-events-none absolute top-0 left-0 ${o.className}`;
				place(el, boxes[i]!, false);
				node.prepend(el);
				if (animate && !reducedMotion.current)
					el.animate(
						[
							{ opacity: 0, scale: 0.85 },
							{ opacity: 1, scale: 1 },
						],
						{ duration: 220, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
					);
				run = { el, a, b };
			}
			next.push(run);
		}
		for (const r of runs) {
			if (next.includes(r)) continue;
			if (animate && !reducedMotion.current)
				r.el
					.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120 })
					.finished.then(() => r.el.remove());
			else r.el.remove();
		}
		runs = next;
	};

	const mo = new MutationObserver((records) => {
		if (
			records.every(
				(r) =>
					r.type === "childList" &&
					[...r.addedNodes, ...r.removedNodes].every(
						(n) => (n as HTMLElement).dataset?.fuse !== undefined
					)
			)
		)
			return;
		measure(true);
	});
	mo.observe(node, {
		subtree: true,
		childList: true,
		attributes: true,
		attributeFilter: o.watch ?? ["data-state"],
	});
	const ro = new ResizeObserver(() => measure(false));
	ro.observe(node);
	measure(false);

	return {
		update(next: FuseOptions) {
			o = next;
			measure(true);
		},
		destroy() {
			mo.disconnect();
			ro.disconnect();
			for (const r of runs) r.el.remove();
		},
	};
};

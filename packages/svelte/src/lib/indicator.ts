import { quintOut } from "svelte/easing";
import { springSmall } from "$lib/springs";

/** `use:indicator` on the list: one `<span data-indicator>` slides behind the active item. Style it with `className` or `[&>[data-indicator]]:…`. */
export type IndicatorOptions = {
	/**
	 * Selector of the active item, relative to the list. With `:hover` or `:focus-visible` in it, the
	 * indicator also follows the pointer and the focus (no attribute changes for those).
	 */
	active?: string;
	/** Classes for the indicator. */
	className?: string;
	/** Extra attributes that mark the active item (e.g. `data-highlighted` in lists). */
	attributes?: string[];
	/** `spring` (default) for selections; `smooth` (no overshoot) for highlights that follow the pointer or arrow keys. */
	curve?: "spring" | "smooth";
};

export const indicator = (list: HTMLElement, options: IndicatorOptions = {}) => {
	let {
		active = '[data-state="active"], [data-state="on"], [aria-current="page"]',
		className = "glass-neutral rounded-md",
		attributes = [],
		curve = "spring",
	} = options;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const ind = document.createElement("span");
	ind.dataset.indicator = "";
	ind.setAttribute("aria-hidden", "true");
	ind.className = `pointer-events-none absolute top-0 left-0 z-0 ${className}`;
	ind.style.opacity = "0";
	ind.style.transition = "opacity 150ms";
	if (getComputedStyle(list).position === "static") list.style.position = "relative";
	list.prepend(ind);

	let box = { x: 0, y: 0, w: 0, h: 0 };
	let first = true;
	let raf = 0;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let shown: HTMLElement | null = null;
	const paint = (b: typeof box) => {
		ind.style.translate = `${b.x}px ${b.y}px`;
		ind.style.width = `${b.w}px`;
		ind.style.height = `${b.h}px`;
	};

	const offset = (el: HTMLElement) => {
		let x = 0;
		let y = 0;
		for (
			let n: HTMLElement | null = el;
			n && n !== list;
			n = n.offsetParent as HTMLElement | null
		) {
			x += n.offsetLeft;
			y += n.offsetTop;
		}
		return { x, y };
	};

	const hideNow = () => {
		clearTimeout(hideTimer);
		shown = null;
		ind.style.transition = "none";
		ind.style.opacity = "0";
		requestAnimationFrame(() => (ind.style.transition = "opacity 150ms"));
	};

	const place = (animate: boolean) => {
		const el = list.querySelector<HTMLElement>(active);
		if (el && el !== ind && el.getClientRects().length === 0) return hideNow();
		if (!el || el === ind) {
			clearTimeout(hideTimer);
			shown = null;
			hideTimer = setTimeout(() => (ind.style.opacity = "0"), 120);
			return;
		}
		clearTimeout(hideTimer);
		shown = el;
		const target = { ...offset(el), w: el.offsetWidth, h: el.offsetHeight };
		const hidden = ind.style.opacity === "0";
		ind.style.opacity = "1";
		cancelAnimationFrame(raf);
		if (!animate || first || hidden || reduced.matches) {
			first = false;
			box = target;
			return paint(box);
		}
		const from = box;
		const t0 = performance.now();
		const step = (t: number) => {
			const k = Math.min(1, (t - t0) / (curve === "smooth" ? 300 : 350));
			const e = curve === "smooth" ? quintOut(k) : springSmall(k);
			box = {
				x: from.x + (target.x - from.x) * e,
				y: from.y + (target.y - from.y) * e,
				w: from.w + (target.w - from.w) * e,
				h: from.h + (target.h - from.h) * e,
			};
			paint(box);
			if (k < 1) raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
	};

	const leave = () => {
		if (!list.querySelector(active)) hideNow();
	};
	list.addEventListener("pointerleave", leave);

	let followRaf = 0;
	const follow = () => {
		if (!/:hover|:focus/.test(active)) return;
		cancelAnimationFrame(followRaf);
		followRaf = requestAnimationFrame(() => {
			if (list.querySelector(active) !== shown) place(true);
		});
	};
	const followEvents = ["pointerover", "pointerout", "focusin", "focusout"] as const;
	for (const ev of followEvents) list.addEventListener(ev, follow);

	const mo = new MutationObserver(() => place(true));
	mo.observe(list, {
		subtree: true,
		childList: true,
		attributes: true,
		attributeFilter: ["data-state", "aria-current", "aria-pressed", ...attributes],
	});
	const ro = new ResizeObserver(() => place(false));
	ro.observe(list);
	place(false);

	return {
		update(o: IndicatorOptions = {}) {
			active = o.active ?? active;
			if (o.className)
				ind.className = `pointer-events-none absolute top-0 left-0 z-0 ${o.className}`;
			place(true);
		},
		destroy() {
			cancelAnimationFrame(raf);
			cancelAnimationFrame(followRaf);
			clearTimeout(hideTimer);
			list.removeEventListener("pointerleave", leave);
			for (const ev of followEvents) list.removeEventListener(ev, follow);
			mo.disconnect();
			ro.disconnect();
			ind.remove();
		},
	};
};

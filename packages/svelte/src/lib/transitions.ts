import { cubicIn, cubicOut, linear } from "svelte/easing";
import { slide, type TransitionConfig } from "svelte/transition";
import { MediaQuery } from "svelte/reactivity";
import { springXSmall } from "$lib/springs";

export const EXIT = 200;

export type FadeScaleParams = {
	minScale?: number;
	minOpacity?: number;
	/** Starting horizontal offset, in % of the element's own width. */
	xPercent?: number;
	duration?: number;
	delay?: number;
	easing?: (t: number) => number;
};

/** Grows from `minScale` while fading in. */
export const fadeScale = (_: Element, params: FadeScaleParams = {}): TransitionConfig => {
	const {
		minScale = 0.7,
		minOpacity = 0,
		xPercent = 0,
		duration = 200,
		delay = 0,
		easing = linear,
	} = params;
	const scale = Math.max(0, Math.min(1, minScale));
	const opacity = Math.max(0, Math.min(1, minOpacity));
	return {
		duration,
		delay,
		easing,
		css: (t: number) =>
			`scale: ${scale + (1 - scale) * t}; opacity: ${Math.min(1, opacity + (1 - opacity) * t)};` +
			(xPercent ? ` transform: translateX(${(1 - t) * xPercent}%);` : ""),
	};
};

export const modalIn = { duration: 350, easing: springXSmall } satisfies FadeScaleParams;

/** Check marks popping in (`in:scale={checkIn}`). */
export const checkIn = { duration: 320, start: 0.3, easing: springXSmall };

/** For floating surfaces. Pair with `origin-(--bits-floating-transform-origin)`. */
export const floatingIn = {
	duration: 300,
	easing: springXSmall,
	minScale: 0.92,
} satisfies FadeScaleParams;
/** Tooltips: quicker and from closer than other floating surfaces. */
export const tooltipIn = {
	duration: 220,
	easing: springXSmall,
	minScale: 0.85,
} satisfies FadeScaleParams;

export const FLOATING_OUT = 120;

export const reducedMotion = new MediaQuery("prefers-reduced-motion: reduce");

export const fold = (node: Element): TransitionConfig => {
	const s = slide(node, { duration: 320, easing: cubicOut });
	return {
		...s,
		css: (t, u) => `${s.css?.(t, u) ?? ""}opacity:${t};scale:${0.98 + 0.02 * t};`,
	};
};

export const unfold = (
	node: HTMLElement,
	{ duration, easing }: { duration: number; easing?: (t: number) => number }
): TransitionConfig => {
	const base = slide(node, { duration: reducedMotion.current ? 0 : duration, easing });
	const rows = [...node.children] as HTMLElement[];
	const step = Math.min(0.12, 0.5 / Math.max(rows.length, 1));
	const span = 1 - step * (rows.length - 1);
	return {
		...base,
		tick: (t) => {
			rows.forEach((row, i) => {
				const k = Math.min(1, Math.max(0, (t - i * step) / span));
				row.style.opacity = k >= 1 ? "" : `${k}`;
				row.style.translate = k >= 1 ? "" : `0 ${(1 - k) * -6}px`;
			});
		},
	};
};

export type Side = "top" | "right" | "bottom" | "left";

const OFFSCREEN: Record<Side, (k: number) => string> = {
	right: (k) => `calc(${k} * (100% + 0.5rem)) 0`,
	left: (k) => `calc(${-k} * (100% + 0.5rem)) 0`,
	bottom: (k) => `0 calc(${k} * (100% + 0.5rem))`,
	top: (k) => `0 calc(${-k} * (100% + 0.5rem))`,
};

export const SHEET_OUT = 220;

export const sheetSlide = (
	_: Element,
	{ side, leaving }: { side: Side; leaving?: boolean }
): TransitionConfig => ({
	duration: leaving ? SHEET_OUT : 480,
	easing: leaving ? cubicIn : springXSmall,
	css: (t) => `translate: ${OFFSCREEN[side](1 - t)};`,
});

export const digitSlot = (
	node: HTMLElement,
	{ going, dir }: { going: boolean; dir: number }
): TransitionConfig => {
	const w = node.getBoundingClientRect().width;
	const y = 0.75 * (going ? -dir : dir);
	return {
		duration: reducedMotion.current ? 0 : going ? 220 : 420,
		easing: going ? cubicOut : springXSmall,
		css: (t) =>
			`width: ${t * w}px; opacity: ${Math.min(1, t * 1.4)}; transform: translateY(${(1 - t) * y}em)`,
	};
};

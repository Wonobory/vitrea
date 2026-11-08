import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Always one array: `cn(["a", cond && "b", className])`. */
export const cn = (inputs: ClassValue[]) => twMerge(clsx(inputs));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};
export const offsetWithin = (el: HTMLElement, root: HTMLElement) => {
	let x = 0;
	let y = 0;
	for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) {
		x += n.offsetLeft;
		y += n.offsetTop;
	}
	return { x, y };
};

/** Window pointer listeners for one drag, from `pointerdown` until `pointerup`/`pointercancel`. Returns a stop function. */
export const trackDrag = (move: (e: PointerEvent) => void, end: (e: PointerEvent) => void) => {
	const up = (e: PointerEvent) => {
		stop();
		end(e);
	};
	const stop = () => {
		removeEventListener("pointermove", move);
		removeEventListener("pointerup", up);
		removeEventListener("pointercancel", up);
	};
	addEventListener("pointermove", move);
	addEventListener("pointerup", up);
	addEventListener("pointercancel", up);
	return stop;
};

/** Swallows the click that follows a drag's `pointerup`, and only that one. */
export const swallowClick = () => {
	const swallow = (e: Event) => {
		e.stopPropagation();
		e.preventDefault();
	};
	addEventListener("click", swallow, { capture: true, once: true });
	setTimeout(() => removeEventListener("click", swallow, true));
};

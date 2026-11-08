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

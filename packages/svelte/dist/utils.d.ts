import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export type WithoutChild<T> = T extends {
    child?: any;
} ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends {
    children?: any;
} ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
    ref?: U | null;
};
type SafeInvoke = {
    <Args extends unknown[], Return>(callback: ((...args: Args) => Return) | null | undefined, ...args: Args): Return | undefined;
    method: <Args extends unknown[], Return>(target: unknown, methodName: PropertyKey, ...args: Args) => Return | undefined;
};
/**
 * Safely invokes callback-like runtime values at shared UI/Web Component boundaries.
 * Nullish values are skipped silently; present non-functions are skipped and logged once per value shape.
 * Use `safeInvoke.method(target, methodName, ...args)` for method-bearing objects that need their original `this` value.
 */
export declare const safeInvoke: SafeInvoke;
export declare const isTouchEvent: (e: Pick<PointerEvent, "pointerType">) => boolean;
export declare const parseStyleString: (styleStr?: string) => Record<string, string> | undefined;
export {};

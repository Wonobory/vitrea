import type { TransitionConfig } from "svelte/transition";
export declare const EXIT = 200;
export type FadeScaleParams = {
    minScale?: number;
    minOpacity?: number;
    /** Starting horizontal offset, in % of the element's own width. */
    xPercent?: number;
    duration?: number;
    delay?: number;
    easing?: (t: number) => number;
};
/**
 * Grows in and fades. With `scale` and not `transform: scale()`: modals are
 * centred with `-translate-x-1/2`, and if that ever becomes a `transform` the
 * two won't overwrite each other. With a spring `t` goes past 1: the scale
 * bounces and the opacity stays at 1.
 */
export declare const fadeScale: (_: Element, params?: FadeScaleParams) => TransitionConfig;
/** How every modal comes in. */
export declare const modalIn: {
    duration: number;
    easing: (p: number) => number;
};
/**
 * Floating surfaces (popover, menus, tooltip, hover card, select, command):
 * the same spring as modals but shorter travel, growing from the trigger
 * (`origin-(--transform-origin)` on the element). Out: a quick fade.
 */
export declare const floatingIn: {
    duration: number;
    easing: (p: number) => number;
    minScale: number;
};
export declare const FLOATING_OUT = 120;

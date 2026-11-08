import { linear } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { springXSmall } from "$lib/springs";

/*
 * How modals come and go. The backdrop doesn't darken: it blurs what's behind
 * from 0 to 10 px (CSS, `backdrop-*` in `app.css`). The modal grows from 0.7
 * to 1 as it appears, in 350 ms with `springXSmall` (it overshoots 1 a little
 * and settles). On the way out both just fade, in 200 ms.
 */
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

/**
 * Grows in and fades. With `scale` and not `transform: scale()`: modals are
 * centred with `-translate-x-1/2`, and if that ever becomes a `transform` the
 * two won't overwrite each other. With a spring `t` goes past 1: the scale
 * bounces and the opacity stays at 1.
 */
export const fadeScale = (_: Element, params: FadeScaleParams = {}): TransitionConfig => {
  const { minScale = 0.7, minOpacity = 0, xPercent = 0, duration = 200, delay = 0, easing = linear } = params;
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

/** How every modal comes in. */
export const modalIn = { duration: 350, easing: springXSmall } satisfies FadeScaleParams;

/**
 * Floating surfaces (popover, menus, tooltip, hover card, select, command):
 * the same spring as modals but shorter travel, growing from the trigger
 * (`origin-(--transform-origin)` on the element). Out: a quick fade.
 */
export const floatingIn = { duration: 300, easing: springXSmall, minScale: 0.92 } satisfies FadeScaleParams;
export const FLOATING_OUT = 120;

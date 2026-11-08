import { quintOut } from "svelte/easing";
import { springSmall } from "$lib/springs";

/**
 * A single glass indicator that slides to the active item of a group (tabs,
 * toggle group, pagination…), like `Segmented` without its fixed columns:
 * it measures the active item, so items can have any width.
 *
 * `use:indicator` on the list. It inserts one absolutely positioned
 * `<span data-indicator>` behind the items and moves it with `springSmall`
 * (instantly with reduced motion, on first paint, and when the list resizes).
 * Style it from the list: `[&>[data-indicator]]:glass-neutral` or with a
 * class in `options.className`.
 */
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
  /**
   * `spring` (default): springSmall, for selections. `smooth`: 300 ms that
   * brakes without overshoot, for a highlight that follows the pointer or the
   * arrow keys (Pujarr's place search): bouncing on every row is noise.
   */
  curve?: "spring" | "smooth";
};

export function indicator(list: HTMLElement, options: IndicatorOptions = {}) {
  let { active = '[data-state="active"], [data-state="on"], [aria-current="page"]', className = "glass-neutral rounded-md", attributes = [], curve = "spring" } = options;
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
  /** The item the indicator is on (null when hidden). */
  let shown: HTMLElement | null = null;
  const paint = (b: typeof box) => {
    ind.style.translate = `${b.x}px ${b.y}px`;
    ind.style.width = `${b.w}px`;
    ind.style.height = `${b.h}px`;
  };

  // Offsets up to the list, so the active item can sit inside other boxes
  // (a calendar day inside its cell). Offsets, not rects: they ignore the
  // transforms of an opening menu or a sliding month.
  const offset = (el: HTMLElement) => {
    let x = 0;
    let y = 0;
    for (let n: HTMLElement | null = el; n && n !== list; n = n.offsetParent as HTMLElement | null) {
      x += n.offsetLeft;
      y += n.offsetTop;
    }
    return { x, y };
  };

  /** Gone in the same frame, no fade: for when what it marked is already gone. */
  const hideNow = () => {
    clearTimeout(hideTimer);
    shown = null;
    ind.style.transition = "none";
    ind.style.opacity = "0";
    requestAnimationFrame(() => (ind.style.transition = "opacity 150ms"));
  };

  const place = (animate: boolean) => {
    const el = list.querySelector<HTMLElement>(active);
    // A hidden item still marked active (Command filtering it out keeps it selected) measures 0×0 at
    // 0,0: sliding there shrank the glass into the top-left corner. Its text is already gone, so the
    // glass goes with it, at once.
    if (el && el !== ind && el.getClientRects().length === 0) return hideNow();
    if (!el || el === ind) {
      // Not at once: moving the pointer from one row to the next, menus clear
      // the highlight for an instant, and hiding there made every move a jump.
      clearTimeout(hideTimer);
      shown = null;
      hideTimer = setTimeout(() => (ind.style.opacity = "0"), 120);
      return;
    }
    clearTimeout(hideTimer);
    shown = el;
    const target = { ...offset(el), w: el.offsetWidth, h: el.offsetHeight };
    // Coming back from hidden it appears in place: sliding in from the last
    // item it was on would be motion that means nothing.
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

  // Leaving the list there's no next row to wait for: hide at once. Otherwise
  // a pointer that grazes a menu on its way to the next trigger left the
  // highlight lingering (~270 ms) after the menu had already moved on.
  const leave = () => {
    if (!list.querySelector(active)) hideNow();
  };
  list.addEventListener("pointerleave", leave);

  // `:hover` and `:focus-visible` change without a mutation. A frame later, once the browser has
  // moved them, and only when the item changes: re-placing the same one restarts its slide.
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
  mo.observe(list, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-state", "aria-current", "aria-pressed", ...attributes] });
  const ro = new ResizeObserver(() => place(false));
  ro.observe(list);
  place(false);

  return {
    update(o: IndicatorOptions = {}) {
      active = o.active ?? active;
      if (o.className) ind.className = `pointer-events-none absolute top-0 left-0 z-0 ${o.className}`;
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
}

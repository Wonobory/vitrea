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
export declare function indicator(list: HTMLElement, options?: IndicatorOptions): {
    update(o?: IndicatorOptions): void;
    destroy(): void;
};

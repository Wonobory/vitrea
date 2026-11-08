/**
 * Press and hover for glass buttons (`.glass-*` in `app.css`): scales to 0.97
 * on press and 1.03 on hover; small ones (icon buttons, ≤ 48 px) go to 0.9 and
 * 1.1, since the other values barely show. Timings and curves from GSAP: press
 * 0.3 s power1.out, release 0.15 s power1.out, enter 0.2 s power2.out, leave
 * 0.2 s power2.inOut.
 *
 * Frame by frame, not a CSS transition: a `transform`/`scale` transition runs
 * on the compositor in its own layer, with the text half a px lower, and at 1×
 * (full HD) it jumped 1 px at the start and the end. For the same reason the
 * ghost appears through `--glass-show` (0–1), not an `opacity` transition.
 * Buttons with this action can't use `transition`/`transition-all` (they
 * include `scale`): only `transition-colors`.
 */
export declare function press(node: HTMLElement, enabled?: boolean): {
    update(v?: boolean): void;
    destroy(): void;
};

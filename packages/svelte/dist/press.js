import { cubicInOut, cubicOut, quadOut } from "svelte/easing";
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
export function press(node, enabled = true) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const small = () => node.offsetWidth <= 48;
    /** `use:press={false}`: no animation (shadcn's `Button` in its non-glass variants). */
    let on = enabled;
    const off = () => !on || node.matches(":disabled, [aria-disabled='true']");
    let scale = 1;
    let show = 0;
    const tween = (get, set) => {
        let raf = 0;
        return (to, ms, curve) => {
            cancelAnimationFrame(raf);
            if (reduced.matches)
                return set(to);
            const from = get();
            const t0 = performance.now();
            const step = (t) => {
                const k = Math.min(1, (t - t0) / ms);
                set(from + (to - from) * curve(k));
                if (k < 1)
                    raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
        };
    };
    // `scale`, not `transform`: it doesn't overwrite Tailwind's `translate-*`.
    const scaleTo = tween(() => scale, (v) => {
        scale = v;
        node.style.scale = v === 1 ? "" : String(v);
    });
    const showTo = tween(() => show, (v) => {
        show = v;
        node.style.setProperty("--glass-show", String(v));
    });
    let pressing = false;
    let hovering = false;
    let focused = false;
    const sync = () => showTo(pressing || hovering || focused ? 1 : 0, 200, cubicOut);
    const isTouch = (e) => e.pointerType === "touch";
    const down = () => {
        if (off())
            return;
        pressing = true;
        sync();
        scaleTo(small() ? 0.9 : 0.97, 300, quadOut);
    };
    const up = (e) => {
        if (!pressing)
            return;
        pressing = false;
        sync();
        // On touch it goes back to 1; with a mouse, to the hover scale if still
        // over it. If it was disabled between press and release (a button that
        // turns into something else when pressed), to 1: it stayed enlarged.
        scaleTo(!isTouch(e) && hovering && !off() ? (small() ? 1.1 : 1.03) : 1, 150, quadOut);
    };
    const enter = (e) => {
        if (isTouch(e) || off())
            return;
        hovering = true;
        sync();
        if (!pressing)
            scaleTo(small() ? 1.1 : 1.03, 200, cubicOut);
    };
    const leave = (e) => {
        // On touch, sliding the finger off the button also releases it.
        if (isTouch(e))
            return up(e);
        hovering = false;
        pressing = false;
        sync();
        scaleTo(1, 200, cubicInOut);
    };
    const focus = () => {
        focused = node.matches(":focus-visible");
        sync();
    };
    const blur = () => {
        focused = false;
        sync();
    };
    const events = [
        ["pointerdown", down],
        ["pointerup", up],
        ["pointercancel", up],
        ["pointerenter", enter],
        ["pointerleave", leave],
        ["focus", focus],
        ["blur", blur],
    ];
    for (const [n, f] of events)
        node.addEventListener(n, f);
    return {
        update(v = true) {
            on = v;
            // Turned off, back to rest: otherwise it kept the scale and the veil from
            // when it was pressed or hovered.
            if (!v) {
                pressing = hovering = false;
                sync();
                scaleTo(1, 120, cubicOut);
            }
        },
        destroy() {
            for (const [n, f] of events)
                node.removeEventListener(n, f);
        },
    };
}

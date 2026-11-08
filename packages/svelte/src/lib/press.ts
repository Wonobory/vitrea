import { reducedMotion } from "$lib/transitions";
import { cubicInOut, cubicOut, quadOut } from "svelte/easing";

/** Scales glass buttons on press and hover. Use `transition-colors`, never `transition`/`transition-all`. `use:press={false}` turns it off. */
export const press = (node: HTMLElement, enabled = true) => {
	const small = () => node.offsetWidth <= 48;
	let on = enabled;
	const off = () => !on || node.matches(":disabled, [aria-disabled='true']");

	let scale = 1;
	let show = 0;
	const tween = (get: () => number, set: (v: number) => void) => {
		let raf = 0;
		const run = (to: number, ms: number, curve: (t: number) => number) => {
			cancelAnimationFrame(raf);
			const from = get();
			if (from === to) return;
			if (reducedMotion.current) return set(to);
			const t0 = performance.now();
			const step = (t: number) => {
				const k = Math.min(1, (t - t0) / ms);
				set(from + (to - from) * curve(k));
				if (k < 1) raf = requestAnimationFrame(step);
			};
			raf = requestAnimationFrame(step);
		};
		return Object.assign(run, { cancel: () => cancelAnimationFrame(raf) });
	};
	const scaleTo = tween(
		() => scale,
		(v) => {
			scale = v;
			node.style.scale = v === 1 ? "" : String(v);
		}
	);
	const showTo = tween(
		() => show,
		(v) => {
			show = v;
			node.style.setProperty("--glass-show", String(v));
		}
	);

	let pressing = false;
	let hovering = false;
	let focused = false;
	const sync = () => showTo(pressing || hovering || focused ? 1 : 0, 200, cubicOut);
	const lift = () => (small() ? 1.1 : 1.03);
	const isTouch = (e: PointerEvent) => e.pointerType === "touch";

	const down = () => {
		if (off()) return;
		pressing = true;
		sync();
		scaleTo(small() ? 0.9 : 0.97, 300, quadOut);
	};
	const up = (e: PointerEvent) => {
		if (!pressing) return;
		pressing = false;
		sync();
		scaleTo(!isTouch(e) && hovering && !off() ? lift() : 1, 150, quadOut);
	};
	const enter = (e: PointerEvent) => {
		if (isTouch(e) || off()) return;
		hovering = true;
		sync();
		if (!pressing) scaleTo(lift(), 200, cubicOut);
	};
	const leave = (e: PointerEvent) => {
		if (isTouch(e)) return up(e);
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
	] as const;
	for (const [n, f] of events) node.addEventListener(n, f as EventListener);
	return {
		update(v = true) {
			on = v;
			if (!v) {
				pressing = hovering = false;
				sync();
				scaleTo(1, 120, cubicOut);
			}
		},
		destroy() {
			scaleTo.cancel();
			showTo.cancel();
			for (const [n, f] of events) node.removeEventListener(n, f as EventListener);
		},
	};
};

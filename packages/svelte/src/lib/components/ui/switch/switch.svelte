<script lang="ts">
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { onMount, untrack } from "svelte";
	import { Tween } from "svelte/motion";
	import { reducedMotion as reduced } from "$lib/transitions";
	import { createSpringEasing } from "$lib/springs";
	import { stretchSpring } from "$lib/glass";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		disabled = false,
		size = "default",
		...restProps
	}: WithoutChildrenOrChild<SwitchPrimitive.RootProps> & {
		size?: "sm" | "default";
	} = $props();

	const SIZES = {
		default: { W: 48, H: 28, kw: 28, kh: 24, hw: 33, hh: 28 },
		sm: { W: 36, H: 20, kw: 20, kh: 16, hw: 24, hh: 20 },
	};
	const s = $derived(SIZES[size]);
	const PAD = 2;
	const travel = $derived(s.W - 2 * PAD - s.kw);

	const easing = createSpringEasing(300, 23);
	const TRAVEL = 320;
	const pos = new Tween(
		untrack(() => (checked ? 1 : 0)),
		{ duration: TRAVEL, easing }
	);
	let dragging = $state(false);
	$effect(() => {
		const to = checked ? 1 : 0;
		untrack(() => !dragging && pos.set(to, { duration: reduced.current ? 0 : TRAVEL }));
	});

	let pressed = $state(false);
	const GROW = 260;
	const SETTLE = 360;
	const held = new Tween(0, { duration: SETTLE, easing });
	const moving = $derived(Math.abs(pos.current - pos.target) > 0.2);
	$effect(() => {
		const on = pressed || moving;
		held.set(on ? 1 : 0, { duration: reduced.current ? 0 : on ? GROW : SETTLE });
	});

	const cx = $derived(PAD + s.kw / 2 + travel * pos.current);

	let stretch = $state(0);
	const stretchy = stretchSpring({
		stiffness: 180,
		damping: 14,
		position: () => cx,
		target: (vel) => Math.min(0.3, 0.02 * vel ** 0.75),
		paint: (v) => (stretch = v),
	});
	$effect(() => {
		void cx;
		if (!reduced.current) untrack(() => stretchy.push());
	});
	onMount(() => () => stretchy.stop());
	const kw = $derived((s.kw + (s.hw - s.kw) * held.current) * (1 + 0.35 * stretch));
	const kh = $derived((s.kh + (s.hh - s.kh) * held.current) * (1 - 0.08 * stretch));

	let start = { x: 0, pos: 0 };
	let dragged = false;
	const down = (e: PointerEvent) => {
		if (disabled || e.button !== 0) return;
		pressed = true;
		dragged = false;
		start = { x: e.clientX, pos: pos.current };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	};
	const move = (e: PointerEvent) => {
		if (!pressed) return;
		const dx = e.clientX - start.x;
		if (!dragged && Math.abs(dx) < 3) return;
		dragged = dragging = true;
		pos.set(Math.min(1, Math.max(0, start.pos + dx / travel)), { duration: 0 });
	};
	const up = () => {
		if (!pressed) return;
		pressed = false;
		if (!dragging) return;
		dragging = false;
		const on = pos.current > 0.5;
		checked = on;
		pos.set(on ? 1 : 0, { duration: reduced.current ? 0 : TRAVEL });
	};
</script>

<svelte:window onpointermove={move} onpointerup={up} onpointercancel={up} onblur={up} />

<SwitchPrimitive.Root
	bind:ref
	bind:checked
	{disabled}
	data-slot="switch"
	data-size={size}
	class={cn([
		"peer relative inline-flex shrink-0 touch-none rounded-full outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
		className,
	])}
	style="width: {s.W}px; height: {s.H}px"
	onpointerdown={down}
	onlostpointercapture={up}
	onclick={(e: MouseEvent) => {
		if (dragged) e.preventDefault();
		dragged = false;
	}}
	{...restProps}
>
	<span
		class="absolute inset-0 rounded-full bg-foreground/15 shadow-[inset_0_1px_2px_rgb(0_0_0/0.1)] dark:bg-input/60 dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.4)]"
	></span>
	<span class="glass-fill absolute inset-0 rounded-full" style:opacity={pos.current}></span>
	<span
		class="knob pointer-events-none absolute top-1/2 rounded-full"
		style:left="{cx}px"
		style:width="{kw}px"
		style:height="{kh}px"
		style:--held={Math.min(Math.max(held.current, 0), 1)}
		aria-hidden="true"
	></span>
</SwitchPrimitive.Root>

<style>
	.knob {
		transform: translate(-50%, -50%);
		background: white;
		box-shadow:
			inset 0 0 0 1px rgb(0 0 0 / 0.06),
			0 1px 3px rgb(0 0 0 / calc(0.22 - 0.06 * var(--held))),
			0 3px 8px -2px rgb(0 0 0 / calc(0.12 + 0.1 * var(--held)));
	}
</style>

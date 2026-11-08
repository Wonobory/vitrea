<script lang="ts">
	/**
	 * A sprung switch. The knob is a white pill that grows past the track while
	 * pressed, dragged or travelling, stretches with its speed, and settles back
	 * when it lands.
	 *
	 * Drag it, or tap it. bits-ui keeps the role, keyboard and state; a drag
	 * sets `checked` itself and swallows the click that follows.
	 */
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { onMount, untrack } from "svelte";
	import { Tween } from "svelte/motion";
	import { MediaQuery } from "svelte/reactivity";
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

	// Track, knob at rest and knob held (it overflows the track, like iOS).
	const SIZES = {
		default: { W: 48, H: 28, kw: 28, kh: 24, hw: 33, hh: 28 },
		sm: { W: 36, H: 20, kw: 20, kh: 16, hw: 24, hh: 20 },
	};
	const s = $derived(SIZES[size]);
	const PAD = 2;
	const travel = $derived(s.W - 2 * PAD - s.kw);

	const reduced = new MediaQuery("prefers-reduced-motion: reduce");

	/** Knob position: 0 = off, 1 = on. */
	// Quick on purpose: a switch answers a tap, it doesn't perform.
	// springXSmall's stiffness with more friction (20 → 23): it still lands, with less bounce.
	const easing = createSpringEasing(300, 23);
	const TRAVEL = 320;
	const pos = new Tween(untrack(() => (checked ? 1 : 0)), { duration: TRAVEL, easing });
	let dragging = $state(false);
	$effect(() => {
		const to = checked ? 1 : 0;
		untrack(() => !dragging && pos.set(to, { duration: reduced.current ? 0 : TRAVEL }));
	});

	/** 0 = at rest, 1 = held. Held while pressed or still on its way. */
	let pressed = $state(false);
	// Unhurried on purpose: the grow and the settle are what you feel when you take the knob.
	const GROW = 260;
	const SETTLE = 360;
	const held = new Tween(0, { duration: SETTLE, easing });
	const moving = $derived(Math.abs(pos.current - pos.target) > 0.2);
	$effect(() => {
		const on = pressed || moving;
		held.set(on ? 1 : 0, { duration: reduced.current ? 0 : on ? GROW : SETTLE });
	});

	const cx = $derived(PAD + s.kw / 2 + travel * pos.current);

	// Stretches along the track with speed (the range lens's spring).
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

	// Dragging.
	let start = { x: 0, pos: 0 };
	let dragged = false;
	function down(e: PointerEvent) {
		if (disabled || e.button !== 0) return;
		pressed = true;
		dragged = false;
		start = { x: e.clientX, pos: pos.current };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}
	function move(e: PointerEvent) {
		if (!pressed) return;
		const dx = e.clientX - start.x;
		if (!dragged && Math.abs(dx) < 3) return;
		dragged = dragging = true;
		pos.set(Math.min(1, Math.max(0, start.pos + dx / travel)), { duration: 0 });
	}
	function up() {
		if (!pressed) return;
		pressed = false;
		if (!dragging) return;
		dragging = false;
		const on = pos.current > 0.5;
		checked = on;
		pos.set(on ? 1 : 0, { duration: reduced.current ? 0 : TRAVEL });
	}

</script>

<!-- Release is heard on the whole window: a fast drag that leaves the switch
     (or the window) still lets go. -->
<svelte:window onpointermove={move} onpointerup={up} onpointercancel={up} onblur={up} />

<SwitchPrimitive.Root
	bind:ref
	bind:checked
	{disabled}
	data-slot="switch"
	data-size={size}
	class={cn(
		"peer relative inline-flex shrink-0 touch-none rounded-full outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
		className
	)}
	style="width: {s.W}px; height: {s.H}px"
	onpointerdown={down}
	onlostpointercapture={up}
	onclick={(e: MouseEvent) => {
		// A drag already decided; don't let the click toggle it back.
		if (dragged) e.preventDefault();
		dragged = false;
	}}
	{...restProps}
>
	<span class="absolute inset-0 rounded-full bg-foreground/15 shadow-[inset_0_1px_2px_rgb(0_0_0/0.1)] dark:bg-input/60 dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.4)]"></span>
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
	/* White in both themes; the shadow deepens while held. */
	.knob {
		transform: translate(-50%, -50%);
		background: white;
		box-shadow:
			inset 0 0 0 1px rgb(0 0 0 / 0.06),
			0 1px 3px rgb(0 0 0 / calc(0.22 - 0.06 * var(--held))),
			0 3px 8px -2px rgb(0 0 0 / calc(0.12 + 0.1 * var(--held)));
	}
</style>

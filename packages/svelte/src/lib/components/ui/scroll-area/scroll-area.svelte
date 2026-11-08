<script lang="ts">
	import { reducedMotion } from "$lib/transitions";
	import { ScrollArea as ScrollAreaPrimitive } from "bits-ui";
	import { Scrollbar } from "./index.js";
	import { cn, type WithoutChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		viewportRef = $bindable(null),
		class: className,
		orientation = "vertical",
		scrollbarXClasses = "",
		scrollbarYClasses = "",
		fade = true,
		drag = false,
		children,
		...restProps
	}: WithoutChild<ScrollAreaPrimitive.RootProps> & {
		orientation?: "vertical" | "horizontal" | "both" | undefined;
		scrollbarXClasses?: string | undefined;
		scrollbarYClasses?: string | undefined;
		viewportRef?: HTMLElement | null;
		/** Fade the content out at an edge while there's more to scroll that way. */
		fade?: boolean;
		/** Drag to scroll with the mouse, with momentum on release. */
		drag?: boolean;
	} = $props();

	const FADE = 28;
	let before = $state(0);
	let after = $state(0);
	const horizontal = $derived(orientation === "horizontal");
	const measure = () => {
		const v = viewportRef;
		if (!v) return;
		const [pos, size, view] = horizontal
			? [v.scrollLeft, v.scrollWidth, v.clientWidth]
			: [v.scrollTop, v.scrollHeight, v.clientHeight];
		before = Math.min(FADE, Math.max(0, pos));
		after = Math.min(FADE, Math.max(0, size - view - pos));
	};
	$effect(() => {
		const v = viewportRef;
		if (!v || !fade) return;
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(v);
		if (v.firstElementChild) ro.observe(v.firstElementChild);
		return () => ro.disconnect();
	});
	type Drag = {
		x: number;
		y: number;
		left: number;
		top: number;
		moved: boolean;
		vx: number;
		vy: number;
		t: number;
	};
	let grab = $state<Drag | null>(null);
	let glide = 0;
	$effect(() => () => cancelAnimationFrame(glide));
	const canX = $derived(orientation !== "vertical");
	const canY = $derived(orientation !== "horizontal");
	const dragStart = (e: PointerEvent) => {
		if (!drag || e.pointerType !== "mouse" || e.button !== 0 || !viewportRef) return;
		if (!(e.target as Element).closest("input, textarea, select, [contenteditable]"))
			e.preventDefault();
		cancelAnimationFrame(glide);
		const v = viewportRef;
		grab = {
			x: e.clientX,
			y: e.clientY,
			left: v.scrollLeft,
			top: v.scrollTop,
			moved: false,
			vx: 0,
			vy: 0,
			t: e.timeStamp,
		};
	};
	const dragMove = (e: PointerEvent) => {
		const g = grab;
		const v = viewportRef;
		if (!g || !v) return;
		const dx = e.clientX - g.x;
		const dy = e.clientY - g.y;
		if (!g.moved && Math.hypot(dx, dy) < 4) return;
		g.moved = true;
		const [px, py] = [v.scrollLeft, v.scrollTop];
		if (canX) v.scrollLeft = g.left - dx;
		if (canY) v.scrollTop = g.top - dy;
		const dt = Math.max(1, e.timeStamp - g.t);
		g.vx = 0.7 * ((v.scrollLeft - px) / dt) + 0.3 * g.vx;
		g.vy = 0.7 * ((v.scrollTop - py) / dt) + 0.3 * g.vy;
		g.t = e.timeStamp;
	};
	const dragEnd = (e: PointerEvent) => {
		const g = grab;
		grab = null;
		const v = viewportRef;
		if (!g?.moved || !v) return;
		window.addEventListener("click", (c) => (c.stopPropagation(), c.preventDefault()), {
			capture: true,
			once: true,
		});
		if (e.timeStamp - g.t > 80 || reducedMotion.current) return;
		let { vx, vy } = g;
		let last = performance.now();
		const step = (now: number) => {
			const dt = now - last;
			last = now;
			v.scrollLeft += vx * dt;
			v.scrollTop += vy * dt;
			const k = Math.pow(0.995, dt);
			vx *= k;
			vy *= k;
			if (Math.hypot(vx, vy) > 0.02) glide = requestAnimationFrame(step);
		};
		glide = requestAnimationFrame(step);
	};

	const mask = $derived(
		fade
			? `linear-gradient(to ${horizontal ? "right" : "bottom"}, transparent, #000 ${before}px, #000 calc(100% - ${after}px), transparent)`
			: undefined
	);
</script>

<svelte:window onpointermove={dragMove} onpointerup={dragEnd} onpointercancel={dragEnd} />

<ScrollAreaPrimitive.Root
	bind:ref
	data-slot="scroll-area"
	class={cn(["relative", className])}
	{...restProps}
>
	<ScrollAreaPrimitive.Viewport
		bind:ref={viewportRef}
		data-slot="scroll-area-viewport"
		class={cn([
			"cn-scroll-area-viewport focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
			drag && "cursor-grab",
			grab?.moved && "cursor-grabbing select-none",
		])}
		style={mask ? `mask-image: ${mask}` : undefined}
		onscroll={fade ? measure : undefined}
		onpointerdown={dragStart}
		onwheel={() => cancelAnimationFrame(glide)}
	>
		{@render children?.()}
	</ScrollAreaPrimitive.Viewport>
	{#if canY}
		<Scrollbar orientation="vertical" class={scrollbarYClasses} />
	{/if}
	{#if canX}
		<Scrollbar orientation="horizontal" class={scrollbarXClasses} />
	{/if}
	<ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>

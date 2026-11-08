<script lang="ts">
	/**
	 * Recessed track, glass-coloured range and a white knob that turns into
	 * glass while dragged (or focused from the keyboard), like Aave's slider
	 * (aave.com/design/building-glass-for-the-web): it grows with
	 * `springSmall`, the button fades out and a copy of the track, thicker,
	 * is bent under it by `Lens`. Moving fast makes it grow a little more.
	 *
	 * The copy is drawn from the value, with the same geometry bits-ui uses:
	 * the knob's centre runs from half a knob (10 px) to width − 10 px.
	 */
	import { Slider as SliderPrimitive } from "bits-ui";
	import { onMount, untrack } from "svelte";
	import { Tween } from "svelte/motion";
	import { MediaQuery } from "svelte/reactivity";
	import { cn, type WithoutChildrenOrChild } from "../../../utils.js";
	import { springSmall } from "../../../springs";
	import { stretchSpring, GLASS } from "../../../glass";
	import Lens from "../../vitrea/Lens.svelte";

	let {
		ref = $bindable(null),
		value = $bindable(),
		orientation = "horizontal",
		min = 0,
		max = 100,
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props();

	const KNOB = 20;
	/** Size while glass, and how much thicker the track looks through it. */
	const ACTIVE = 26;
	const THICK = 1.8;
	const STRENGTH = 0.22;

	const trackClass =
		"relative grow overflow-hidden rounded-full bg-input/70 shadow-[inset_0_1px_2px_rgb(0_0_0/0.12)] data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2 dark:bg-input/40 dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.45)]";
	const rangeClass =
		"absolute rounded-full bg-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-1px_0_rgb(0_0_0/0.15)] select-none data-horizontal:h-full data-vertical:w-full dark:bg-[oklch(0.55_0.19_273)]";

	// ponytail: glass only on horizontal sliders; vertical ones keep the plain knob.
	const horizontal = $derived(orientation === "horizontal");
	const values = $derived<number[]>(Array.isArray(value) ? value : [value ?? min]);

	let width = $state(0);
	let pressed = $state(false);
	let keyboard = $state(false);
	let active = $state(0);
	/** What sits behind the slider: the copy the glass bends has to be opaque. */
	let backdrop = $state("var(--background)");
	const reduced = new MediaQuery("prefers-reduced-motion: reduce");

	/** 0 = knob at rest, 1 = glass. */
	const glass = new Tween(0, { duration: 500, easing: springSmall });
	$effect(() => {
		glass.set(horizontal && (pressed || keyboard) ? 1 : 0, { duration: reduced.current ? 0 : 500 });
	});

	const at = (v: number) => KNOB / 2 + (width - KNOB) * Math.min(Math.max((v - min) / (max - min || 1), 0), 1);
	const cx = $derived(at(values[active] ?? min));
	const from = $derived(values.length > 1 ? at(Math.min(...values)) : 0);
	const to = $derived(at(Math.max(...values)));

	let stretch = $state(0);
	const stretchy = stretchSpring({
		stiffness: 180,
		damping: 14,
		position: () => cx,
		target: (vel) => Math.min(0.35, Math.max(Math.min(0.35, 0.012 * vel ** 0.75), pressed ? 0.175 : 0)),
		paint: (v) => (stretch = v),
	});
	$effect(() => {
		void cx;
		void pressed;
		if (!reduced.current && glass.current > 0.01) untrack(() => stretchy.push());
	});

	const g = $derived(Math.min(Math.max(glass.current, 0), 1));
	const d = $derived(KNOB + (ACTIVE - KNOB) * glass.current);
	const lens = $derived(d * (1 + 0.2 * stretch));
	const showGlass = $derived(glass.current > 0.01 && width > 0);

	/** The first painted background up the tree. */
	function backdropOf(el: Element | null) {
		for (let n = el; n; n = n.parentElement) {
			const c = getComputedStyle(n).backgroundColor;
			if (c && c !== "transparent" && !/(,\s*0\)|\/\s*0\))$/.test(c)) return c;
		}
		return "var(--background)";
	}

	$effect(() => {
		if (!ref) return;
		const ro = new ResizeObserver(() => (width = ref?.offsetWidth ?? 0));
		ro.observe(ref);
		return () => ro.disconnect();
	});

	onMount(() => {
		const release = () => (pressed = false);
		window.addEventListener("pointerup", release);
		window.addEventListener("pointercancel", release);
		return () => {
			stretchy.stop();
			window.removeEventListener("pointerup", release);
			window.removeEventListener("pointercancel", release);
		};
	});
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	bind:ref
	bind:value={value as never}
	data-slot="slider"
	{orientation}
	{min}
	{max}
	onpointerdowncapture={() => {
		backdrop = backdropOf(ref);
		pressed = true;
	}}
	class={cn(
		"data-vertical:min-h-40 relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col",
		className
	)}
	{...restProps}
>
	{#snippet children({ thumbItems })}
		<span data-slot="slider-track" data-orientation={orientation} class={trackClass}>
			<SliderPrimitive.Range data-slot="slider-range" class={rangeClass} />
		</span>
		{#if showGlass}
			<Lens
				x={cx}
				y={4}
				w={lens}
				h={lens}
				radius={lens / 2}
				shape={{ w: ACTIVE, h: ACTIVE, radius: ACTIVE / 2 }}
				glass={GLASS}
				dx={STRENGTH * d}
				dy={STRENGTH * d}
				chroma={0.65}
				specular={1.5}
				background={backdrop}
				{width}
				height={8}
			>
				<div class="flex h-2 w-full" style:transform="scaleY({1 + (THICK - 1) * g})">
					<span data-orientation="horizontal" class={trackClass}>
						<span data-orientation="horizontal" class={rangeClass} style:left="{from}px" style:right="{width - to}px"></span>
					</span>
				</div>
			</Lens>
		{/if}
		{#each thumbItems as thumb (thumb.index)}
			{@const glassy = showGlass && thumb.index === active}
			<SliderPrimitive.Thumb
				data-slot="slider-thumb"
				index={thumb.index}
				onfocus={(e: FocusEvent) => {
					active = thumb.index;
					// bits-ui focuses the knob itself on pointerdown, and Chrome calls that `:focus-visible`.
					keyboard = !pressed && (e.currentTarget as HTMLElement).matches(":focus-visible");
					if (keyboard) backdrop = backdropOf(ref);
				}}
				onblur={() => (keyboard = false)}
				data-keyboard={keyboard && thumb.index === active ? "" : undefined}
				style={glassy ? `scale: ${lens / KNOB}; transition-property: box-shadow;` : undefined}
				class="block size-5 shrink-0 cursor-grab rounded-full bg-black/[0.02] shadow-[0_1px_3px_rgb(0_0_0/0.22),0_4px_12px_-2px_rgb(0_0_0/0.12)] transition-[scale,box-shadow] duration-[350ms] ease-[var(--spring-small)] outline-none select-none hover:scale-110 data-keyboard:ring-4 data-keyboard:ring-ring/40 active:cursor-grabbing data-active:shadow-[0_1px_2px_rgb(0_0_0/0.14),0_6px_16px_-2px_rgb(0_0_0/0.2)] disabled:pointer-events-none disabled:opacity-50 data-vertical:data-active:scale-125 dark:bg-white/12"
			>
				<!-- The white button; it fades out to leave the glass. -->
				<span
					class="absolute inset-0 rounded-full bg-white shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]"
					style:opacity={glassy ? 1 - g : 1}
				></span>
			</SliderPrimitive.Thumb>
		{/each}
	{/snippet}
</SliderPrimitive.Root>

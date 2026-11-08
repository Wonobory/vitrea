<script lang="ts">
	import { Slider as SliderPrimitive } from "bits-ui";
	import { onMount, untrack } from "svelte";
	import { Tween } from "svelte/motion";
	import { reducedMotion as reduced } from "$lib/transitions";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import { springSmall } from "$lib/springs";
	import { stretchSpring, LENS_ROUND } from "$lib/glass";
	import Lens from "$lib/components/vitrea/Lens.svelte";

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
	const ACTIVE = 26;
	const THICK = 1.8;
	const STRENGTH = 0.22;

	const trackClass =
		"relative grow overflow-hidden rounded-full bg-input/70 shadow-[inset_0_1px_2px_rgb(0_0_0/0.12)] data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2 dark:bg-input/40 dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.45)]";
	const rangeClass =
		"absolute rounded-full bg-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-1px_0_rgb(0_0_0/0.15)] select-none data-horizontal:h-full data-vertical:w-full dark:bg-[oklch(0.55_0.19_273)]";

	const horizontal = $derived(orientation === "horizontal");
	const values = $derived<number[]>(Array.isArray(value) ? value : [value ?? min]);

	let width = $state(0);
	let pressed = $state(false);
	let keyboard = $state(false);
	let active = $state(0);

	const glass = new Tween(0, { duration: 500, easing: springSmall });
	$effect(() => {
		glass.set(horizontal && (pressed || keyboard) ? 1 : 0, { duration: reduced.current ? 0 : 500 });
	});

	const at = (v: number) =>
		KNOB / 2 + (width - KNOB) * Math.min(Math.max((v - min) / (max - min || 1), 0), 1);
	const cx = $derived(at(values[active] ?? min));
	const from = $derived(values.length > 1 ? at(Math.min(...values)) : 0);
	const to = $derived(at(Math.max(...values)));

	let stretch = $state(0);
	const stretchy = stretchSpring({
		stiffness: 180,
		damping: 14,
		position: () => cx,
		target: (vel) => Math.min(0.35, Math.max(0.012 * vel ** 0.75, pressed ? 0.175 : 0)),
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

	$effect(() => {
		if (!ref) return;
		const ro = new ResizeObserver(() => (width = ref?.offsetWidth ?? 0));
		ro.observe(ref);
		return () => ro.disconnect();
	});

	onMount(() => () => stretchy.stop());
</script>

<svelte:window onpointerup={() => (pressed = false)} onpointercancel={() => (pressed = false)} />

<SliderPrimitive.Root
	bind:ref
	bind:value={value as never}
	data-slot="slider"
	{orientation}
	{min}
	{max}
	onpointerdowncapture={() => {
		pressed = true;
	}}
	class={cn([
		"data-vertical:min-h-40 relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col",
		className,
	])}
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
				{...LENS_ROUND}
				dx={STRENGTH * d}
				dy={STRENGTH * d}
				{width}
				height={8}
			>
				<div class="flex h-2 w-full" style:transform="scaleY({1 + (THICK - 1) * g})">
					<span data-orientation="horizontal" class={trackClass}>
						<span
							data-orientation="horizontal"
							class={rangeClass}
							style:left="{from}px"
							style:right="{width - to}px"
						></span>
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
					keyboard = !pressed && (e.currentTarget as HTMLElement).matches(":focus-visible");
				}}
				onblur={() => (keyboard = false)}
				data-keyboard={keyboard && thumb.index === active ? "" : undefined}
				style={glassy ? `scale: ${lens / KNOB}; transition-property: box-shadow;` : undefined}
				class="block size-5 shrink-0 cursor-grab rounded-full bg-black/[0.02] shadow-[0_1px_3px_rgb(0_0_0/0.22),0_4px_12px_-2px_rgb(0_0_0/0.12)] transition-[scale,box-shadow] duration-[350ms] ease-[var(--spring-small)] outline-none select-none hover:scale-110 data-keyboard:ring-4 data-keyboard:ring-ring/40 active:cursor-grabbing data-active:shadow-[0_1px_2px_rgb(0_0_0/0.14),0_6px_16px_-2px_rgb(0_0_0/0.2)] disabled:pointer-events-none disabled:opacity-50 data-vertical:data-active:scale-125 dark:bg-white/12"
			>
				<span
					class="absolute inset-0 rounded-full bg-white shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]"
					style:opacity={glassy ? 1 - g : 1}
				></span>
			</SliderPrimitive.Thumb>
		{/each}
	{/snippet}
</SliderPrimitive.Root>

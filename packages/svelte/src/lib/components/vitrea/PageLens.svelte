<script lang="ts">
	import { swallowClick, trackDrag } from "$lib/utils";
	import { onMount, untrack } from "svelte";
	import { Tween } from "svelte/motion";
	import { reducedMotion as reduced } from "$lib/transitions";
	import { springSmall } from "$lib/springs";
	import { stretchSpring, LENS_SELECTOR, selectorShift } from "$lib/glass";
	import Lens from "$lib/components/vitrea/Lens.svelte";
	import { Button } from "$lib/components/ui/button";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

	let {
		pages,
		page = $bindable(1),
		visible = 7,
		label = "Pagination",
		onchange,
	}: {
		/** Total number of pages. */
		pages: number;
		/** Current page, from 1. */
		page?: number;
		/** Slots shown in the strip (odd keeps the lens centred on a number). */
		visible?: number;
		label?: string;
		onchange?: (page: number) => void;
	} = $props();

	const SLOT = 40;
	const HEIGHT = 40;
	const LENS = { w: 38, h: 32, radius: 9 };
	const TRAVEL = 420;
	const MAX_JUMP = 4;

	const width = $derived(visible * SLOT);

	let fromDrag = false;
	const pos = new Tween(
		untrack(() => page),
		{ duration: TRAVEL, easing: springSmall }
	);
	$effect(() => {
		const target = page;
		untrack(() => {
			const from = pos.current;
			if (!fromDrag && Math.abs(target - from) > MAX_JUMP)
				pos.set(target - Math.sign(target - from) * MAX_JUMP, { duration: 0 });
			pos.set(target, { duration: reduced.current ? 0 : TRAVEL });
			fromDrag = false;
		});
	});

	const clampPage = (p: number) => Math.min(pages, Math.max(1, p));
	const go = (p: number) => {
		const n = clampPage(p);
		if (n === page) return;
		page = n;
		onchange?.(n);
	};

	const reach = $derived(Math.ceil(visible / 2) + 1);
	const first = $derived(Math.max(1, Math.floor(pos.current) - reach));
	const last = $derived(Math.min(pages, Math.ceil(pos.current) + reach));
	const nearby = $derived(
		Array.from({ length: Math.max(0, last - first + 1) }, (_, i) => first + i)
	);
	const leftOf = (p: number) => width / 2 + (p - pos.current) * SLOT - SLOT / 2;

	let stretch = $state(0);
	let mounted = $state(false);
	const grow = stretchSpring({
		stiffness: 66,
		damping: 4.5,
		position: () => pos.current * SLOT,
		target: (vel) => Math.min(0.3, Math.sqrt(vel) * 0.11),
		paint: (v) => (stretch = v),
	});
	$effect(() => {
		void pos.current;
		if (!reduced.current) untrack(() => grow.push());
	});
	const lw = $derived(LENS.w * (1 + 0.3 * stretch));
	const lh = $derived(LENS.h * (1 - 0.06 * stretch));

	let grab: { x: number; from: number; moved: boolean; v: number; t: number } | null = null;
	const under = $derived(clampPage(Math.round(pos.current)));
	let stopDrag = () => {};
	const dragStart = (e: PointerEvent) => {
		if (e.button !== 0) return;
		grab = { x: e.clientX, from: pos.current, moved: false, v: 0, t: e.timeStamp };
		stopDrag = trackDrag(dragMove, dragEnd);
	};
	const dragMove = (e: PointerEvent) => {
		const g = grab;
		if (!g) return;
		const dx = e.clientX - g.x;
		if (!g.moved && Math.abs(dx) < 4) return;
		g.moved = true;
		let p = g.from - dx / SLOT;
		if (p < 1) p = 1 - (1 - p) * 0.3;
		if (p > pages) p = pages + (p - pages) * 0.3;
		const dt = Math.max(1, e.timeStamp - g.t);
		g.v = 0.7 * ((p - pos.current) / dt) + 0.3 * g.v;
		g.t = e.timeStamp;
		pos.set(p, { duration: 0 });
	};
	const dragEnd = (e: PointerEvent) => {
		const g = grab;
		grab = null;
		if (!g?.moved) return;
		if (e.type === "pointerup") swallowClick();
		const fling = e.timeStamp - g.t > 80 ? 0 : Math.max(-8, Math.min(8, g.v * 300));
		const target = clampPage(Math.round(pos.current + fling));
		if (target === page) pos.set(page, { duration: reduced.current ? 0 : TRAVEL });
		else {
			fromDrag = true;
			go(target);
		}
	};

	let track: HTMLElement;
	onMount(() => {
		let acc = 0;
		const wheel = (e: WheelEvent) => {
			e.preventDefault();
			acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			while (Math.abs(acc) >= 40) {
				go(page + Math.sign(acc));
				acc -= Math.sign(acc) * 40;
			}
		};
		mounted = true;
		track.addEventListener("wheel", wheel, { passive: false });
		return () => (track.removeEventListener("wheel", wheel), grow.stop(), stopDrag());
	});

	const onKey = (e: KeyboardEvent) => {
		const d = { ArrowRight: 1, ArrowLeft: -1, PageDown: visible, PageUp: -visible }[e.key];
		if (e.key === "Home") go(1);
		else if (e.key === "End") go(pages);
		else if (d) go(page + d);
		else return;
		e.preventDefault();
	};
</script>

<nav aria-label={label} class="inline-flex items-center gap-2">
	<Button
		variant="ghost"
		size="icon"
		onclick={() => go(page - 1)}
		disabled={page <= 1}
		aria-label="Previous page"
	>
		<ChevronLeftIcon />
	</Button>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={track}
		class="track relative cursor-grab touch-pan-y overflow-hidden rounded-xl border select-none active:cursor-grabbing"
		style:width="{width}px"
		style:height="{HEIGHT}px"
		onkeydown={onKey}
		onpointerdown={dragStart}
	>
		<div class="strip absolute inset-0">
			{#each nearby as p (p)}
				<button
					type="button"
					class="absolute top-0 flex h-full items-center justify-center text-sm font-medium tabular-nums text-muted-foreground transition-colors hover:text-foreground"
					style:left="{leftOf(p)}px"
					style:width="{SLOT}px"
					aria-current={p === page ? "page" : undefined}
					aria-label="Page {p}"
					tabindex={p === page ? 0 : -1}
					onclick={() => go(p)}>{p}</button
				>
			{/each}
		</div>

		{#if mounted}
			<Lens
				x={width / 2}
				y={HEIGHT / 2}
				w={lw}
				h={lh}
				radius={LENS.radius}
				shape={LENS}
				{...LENS_SELECTOR}
				{...selectorShift(lw, lh)}
				{width}
				height={HEIGHT}
			>
				<div class="relative h-full">
					{#each nearby as p (p)}
						<span
							class={[
								"absolute top-0 flex h-full items-center justify-center text-sm font-semibold tabular-nums",
								p === under ? "text-primary" : "text-muted-foreground",
							]}
							style:left="{leftOf(p)}px"
							style:width="{SLOT}px">{p}</span
						>
					{/each}
				</div>
			</Lens>
			<span
				class="rim pointer-events-none absolute"
				style:left="{width / 2}px"
				style:top="{HEIGHT / 2}px"
				style:width="{lw}px"
				style:height="{lh}px"
				style:border-radius="{LENS.radius}px"
				aria-hidden="true"
			></span>
		{/if}
	</div>

	<Button
		variant="ghost"
		size="icon"
		onclick={() => go(page + 1)}
		disabled={page >= pages}
		aria-label="Next page"
	>
		<ChevronRightIcon />
	</Button>

	<span class="ml-1 text-xs whitespace-nowrap text-muted-foreground tabular-nums" aria-live="polite"
		>of {pages.toLocaleString("en-GB")}</span
	>
</nav>

<style>
	.track {
		background: linear-gradient(rgb(0 0 0 / 0.05), rgb(0 0 0 / 0.05)), var(--card);
	}
	:global(.dark) .track {
		background: var(--card);
	}
	.strip {
		mask-image: linear-gradient(to right, transparent, black 30%, black 70%, transparent);
	}
	.rim {
		transform: translate(-50%, -50%);
		box-shadow: var(--glass-rim);
	}
	:global(.dark) .rim {
		background: var(--glass-veil);
	}
</style>

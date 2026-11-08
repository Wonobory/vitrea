<script lang="ts">
	let {
		title,
		sub = false,
		values,
		min,
		max,
		onChange,
		lo,
		hi,
		log = true,
		round,
		short,
		unit = "",
		ticks,
	}: {
		title: string;
		/** Second-level title, for use inside a section. */
		sub?: boolean;
		values: number[];
		/** The bounds set ("" = no bound). */
		min: string;
		max: string;
		/** On release, and only if something changed. */
		onChange: (min: string, max: string) => void;
		/** The axis domain; anything outside falls in the first or last bar. */
		lo: number;
		hi: number;
		/** Logarithmic axis, for values spanning orders of magnitude. */
		log?: boolean;
		/** Rounds the value while dragging (e.g. to the nearest 1,000). */
		round: (v: number) => number;
		/** Short label without unit: "30k", "1,200". */
		short: (v: number) => string;
		unit?: string;
		ticks: [number, string][];
	} = $props();

	const BARS = 36;
	const t = (v: number) => (log ? Math.log10(v) : v);
	const tLo = $derived(t(lo));
	const tSpan = $derived(t(hi) - tLo);
	const position = (v: number) => Math.min(1, Math.max(0, (t(v) - tLo) / tSpan));
	const valueAt = (f: number) => (log ? 10 ** (tLo + f * tSpan) : lo + f * (hi - lo));

	let draft = $state<{ min: string; max: string } | null>(null);
	const minV = $derived(draft ? draft.min : min);
	const maxV = $derived(draft ? draft.max : max);

	const counts = $derived.by(() => {
		const n = Array(BARS).fill(0);
		for (const v of values) n[Math.min(BARS - 1, Math.floor(position(v) * BARS))]++;
		return n;
	});
	const histogram = $derived.by(() => {
		const top = Math.max(1, ...counts);
		return counts.map((c, i) => {
			const centre = valueAt((i + 0.5) / BARS);
			const inside = (!minV || centre >= Number(minV)) && (!maxV || centre <= Number(maxV));
			return { c, height: c ? Math.max(0.06, Math.sqrt(c / top)) : 0, inside };
		});
	});

	const bound = (f: number, end: 0 | 1) =>
		(f <= 0.005 && end === 0) || (f >= 0.995 && end === 1) ? "" : String(round(valueAt(f)));
	const fMin = $derived(minV ? position(Number(minV)) : 0);
	const fMax = $derived(maxV ? position(Number(maxV)) : 1);

	let canvas = $state<HTMLDivElement | null>(null);
	let drag: { mode: "new" | "min" | "max" | "both"; origin: number; x0: number } | null = null;
	let hover = $state<number | null>(null);
	let dragging = $state(false);
	let nearEdge = $state(false);

	const fraction = (e: PointerEvent, r: DOMRect) =>
		Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));

	const edgeNear = (f: number, width: number): "min" | "max" | "both" | null => {
		const nMin = Math.abs(f - fMin) * width < 8;
		const nMax = Math.abs(f - fMax) * width < 8;
		return nMin && nMax ? "both" : nMin ? "min" : nMax ? "max" : null;
	};

	const onDown = (e: PointerEvent) => {
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		const r = canvas!.getBoundingClientRect();
		const f = fraction(e, r);
		drag = { mode: edgeNear(f, r.width) ?? "new", origin: f, x0: e.clientX };
		dragging = true;
		draft = { min: minV, max: maxV };
	};

	const onMove = (e: PointerEvent) => {
		const r = canvas!.getBoundingClientRect();
		const f = fraction(e, r);
		hover = Math.min(BARS - 1, Math.floor(f * BARS));
		if (!drag) {
			nearEdge = !!edgeNear(f, r.width);
			return;
		}
		if (Math.abs(e.clientX - drag.x0) <= 3) return;
		if (drag.mode === "both") drag.mode = e.clientX < drag.x0 ? "min" : "max";
		if (drag.mode === "min") draft = { min: bound(Math.min(f, fMax), 0), max: maxV };
		else if (drag.mode === "max") draft = { min: minV, max: bound(Math.max(f, fMin), 1) };
		else {
			const [a, b] = drag.origin <= f ? [drag.origin, f] : [f, drag.origin];
			draft = { min: bound(a, 0), max: bound(b, 1) };
		}
	};

	const onUp = (e: PointerEvent) => {
		const a = drag;
		const b = draft;
		cancel();
		if (!a) return;
		if (Math.abs(e.clientX - a.x0) > 3) {
			if (b && (b.min !== min || b.max !== max)) onChange(b.min, b.max);
			return;
		}
		const i = Math.min(BARS - 1, Math.floor(a.origin * BARS));
		const bMin = bound(i / BARS, 0);
		const bMax = bound((i + 1) / BARS, 1);
		if (min === bMin && max === bMax) onChange("", "");
		else onChange(bMin, bMax);
	};

	const cancel = () => {
		drag = null;
		dragging = false;
		draft = null;
	};

	const handles = $derived(fMax - fMin > 0.06);

	const withUnit = (s: string) => (unit ? `${s} ${unit}` : s);
	const span = (a: number, b: number) => withUnit(`${short(a)}–${short(b)}`);
	const auctions = (n: number) =>
		`${n.toLocaleString("en-GB")} ${n === 1 ? "auction" : "auctions"}`;

	const readout = $derived.by((): { n: number | null; text: string } => {
		const a = minV;
		const b = maxV;
		if (hover != null && !dragging)
			return {
				n: histogram[hover]?.c ?? 0,
				text: span(round(valueAt(hover / BARS)), round(valueAt((hover + 1) / BARS))),
			};
		if (!a && !b) return { n: null, text: sub ? "" : "Drag to choose" };
		const from = a ? Number(a) : -Infinity;
		const to = b ? Number(b) : Infinity;
		const n = values.filter((v) => v >= from && v <= to).length;
		const text =
			a && b
				? span(Number(a), Number(b))
				: a
					? `from ${withUnit(short(Number(a)))}`
					: `up to ${withUnit(short(Number(b)))}`;
		return { n, text };
	});
</script>

<div class="flex items-baseline justify-between gap-2 whitespace-nowrap">
	<p
		role="heading"
		aria-level={sub ? 3 : 2}
		class={[
			"shrink-0 tracking-wider uppercase",
			sub ? "text-3xs text-muted-foreground" : "text-2xs font-semibold text-foreground",
		]}
	>
		{title}
	</p>
	<span
		class="flex min-w-0 items-baseline justify-end gap-1.5 font-mono text-2xs text-muted-foreground tabular-nums"
	>
		{#if readout.n != null}
			<span class={["truncate", dragging && "text-foreground"]}>{auctions(readout.n)}</span>
			<span class="opacity-50">·</span>
		{/if}
		<span class="shrink-0">{readout.text || " "}</span>
	</span>
</div>
<div aria-hidden="true">
	<div
		data-vaul-no-drag
		role="presentation"
		onpointerdown={onDown}
		onpointermove={onMove}
		onpointerup={onUp}
		onpointercancel={cancel}
		onpointerleave={() => {
			hover = null;
			nearEdge = false;
		}}
		class={[
			"-mx-2 touch-none px-2 select-none",
			nearEdge ? "cursor-ew-resize" : "cursor-crosshair",
		]}
	>
		<div bind:this={canvas} class="relative mt-2 flex h-12 items-end gap-0.5">
			{#each histogram as b, i (i)}
				<span
					class={["bar", b.inside && "inside", hover === i && "hovered"]}
					style:height="{b.height * 100}%"
				></span>
			{/each}
			<span
				class={["frame", !minV && !maxV && "loose"]}
				style:left="{fMin * 100}%"
				style:width="{(fMax - fMin) * 100}%"
			>
				{#if handles}<span class="glass-panel handle left"></span><span
						class="glass-panel handle right"
					></span>{/if}
			</span>
			{#if handles}
				{#each [[fMin, minV], [fMax, maxV]] as const as [f, v], i (i)}
					{#if v}
						<span
							class={["glass-panel label", dragging && "visible"]}
							style:left="{f * 100}%"
							style:translate="{-f * 100}% 0">{short(Number(v))}</span
						>
					{/if}
				{/each}
			{:else if minV && maxV}
				<span
					class={["glass-panel label", dragging && "visible"]}
					style:left="{((fMin + fMax) / 2) * 100}%"
					style:translate="{-((fMin + fMax) / 2) * 100}% 0">{span(Number(minV), Number(maxV))}</span
				>
			{/if}
		</div>
	</div>
	<div class="relative mt-1 h-3 border-t border-border">
		{#each ticks as [v, l] (v)}
			<span
				class="absolute top-0.5 -translate-x-1/2 font-mono text-3xs text-muted-foreground/60"
				style:left="{position(v) * 100}%">{l}</span
			>
		{/each}
	</div>
</div>

<style>
	.bar {
		flex: 1;
		border-radius: 2px 2px 0 0;
		background-color: color-mix(in oklch, var(--muted-foreground) 20%, transparent);
		transition:
			background-color 200ms,
			height 400ms cubic-bezier(0.25, 1, 0.5, 1);
	}
	.bar.hovered {
		background-color: color-mix(in oklch, var(--muted-foreground) 45%, transparent);
	}
	.bar.inside {
		background-color: color-mix(in oklch, var(--primary) 65%, transparent);
		background-image: linear-gradient(
			color-mix(in oklch, var(--primary) 85%, transparent),
			color-mix(in oklch, var(--primary) 50%, transparent)
		);
	}
	.bar.inside.hovered {
		background-image: linear-gradient(
			var(--primary),
			color-mix(in oklch, var(--primary) 80%, transparent)
		);
	}
	.frame {
		position: absolute;
		top: -0.375rem;
		bottom: -0.375rem;
		border-radius: 0.5rem;
		pointer-events: none;
		background: color-mix(in oklch, var(--primary) 7%, transparent);
		box-shadow:
			inset 0 0 0 1.5px color-mix(in oklch, var(--primary) 55%, transparent),
			0 4px 14px -6px color-mix(in oklch, var(--primary) 40%, transparent);
		transition:
			background 200ms,
			box-shadow 200ms;
	}
	.frame.loose {
		background: transparent;
		box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--primary) 25%, transparent);
	}
	.handle {
		position: absolute;
		top: 50%;
		width: 0.5rem;
		height: 1.75rem;
		translate: 0 -50%;
		border-radius: 999px;
	}
	.handle::after {
		content: "";
		position: absolute;
		inset: 0.5rem 0.1875rem;
		border-radius: 999px;
		background: color-mix(in oklch, var(--muted-foreground) 55%, transparent);
	}
	.handle.left {
		left: -0.25rem;
	}
	.handle.right {
		right: -0.25rem;
	}
	.label {
		position: absolute;
		top: calc(100% + 0.375rem);
		z-index: 1;
		padding: 0.125rem 0.375rem;
		border-radius: 999px;
		pointer-events: none;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		opacity: 0;
		transition: opacity 150ms;
	}
	.label.visible {
		opacity: 1;
	}
</style>

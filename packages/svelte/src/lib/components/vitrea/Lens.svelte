<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import { backdropOf, glassMapCached, type GlassParams } from "$lib/glass";
	import { mode } from "mode-watcher";

	type Props = {
		/** Lens centre, in px of the container `children` is a copy of. */
		x: number;
		y: number;
		/** Current lens size and radius. */
		w: number;
		h: number;
		radius: number;
		/** The shape the map is painted for (`feImage` stretches it to the current one). */
		shape: { w: number; h: number; radius: number };
		glass: Record<"light" | "dark", GlassParams>;
		/** Maximum displacement, in px, on each axis. */
		dx: number;
		dy: number;
		chroma: number;
		specular: number;
		/** Opaque background of the copy. Defaults to the first opaque background behind the lens. */
		background?: string;
		/** Size of the container being copied. */
		width: number;
		height: number;
		children: Snippet;
	};
	let {
		x,
		y,
		w,
		h,
		radius,
		shape,
		glass,
		dx,
		dy,
		chroma,
		specular,
		background,
		width,
		height,
		children,
	}: Props = $props();

	const uid = $props.id();
	let mounted = $state(false);
	let webkit = $state(false);
	onMount(() => {
		mounted = true;
		const ua = navigator.userAgent;
		webkit = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Android/.test(ua);
	});
	const dark = $derived(mounted && mode.current === "dark");
	let host = $state<HTMLDivElement>();
	let detected = $state("var(--background)");
	$effect(() => {
		void dark;
		detected = backdropOf(host?.parentElement ?? null);
	});
	const px = $derived(webkit ? 1 / window.devicePixelRatio : 1);

	const map = $derived(
		glassMapCached(shape.w, shape.h, shape.radius, dark ? glass.dark : glass.light)
	);
	const hx = $derived(Math.ceil(dx * (1 + 0.2 * chroma)) + 1);
	const hy = $derived(Math.ceil(dy * (1 + 0.2 * chroma)) + 1);
	const boxW = $derived(w + 2 * hx);
	const boxH = $derived(h + 2 * hy);
	const scaleX = $derived((2 * dx) / boxW);
	const scaleY = $derived((2 * dy) / boxH);
	const scale = $derived(Math.max(scaleX, scaleY, 1e-6));
	const shrink = $derived.by(() => {
		const a = scaleX / scale;
		const b = scaleY / scale;
		return `${a} 0 0 0 ${0.5 * (1 - a)}  0 ${b} 0 0 ${0.5 * (1 - b)}  0 0 1 0 0  0 0 0 1 0`;
	});
	const id = $derived(
		webkit
			? `glass-${uid}-${dark ? "d" : "l"}-${Math.round(x * 4)}-${Math.round(y * 4)}-${Math.round(w * 4)}-${Math.round(h * 4)}-${Math.round(specular * 50)}`
			: `glass-${uid}`
	);
	const channels = [
		[0.2, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0", "r"],
		[0.1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0", "g"],
		[0, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0", "b"],
	] as const;
	const k = $derived(1 + (128 * specular) / 255);
	const shade = $derived(
		`0 0 ${-specular} 0 ${k}  0 0 ${-specular} 0 ${k}  0 0 ${-specular} 0 ${k}  0 0 0 0 1`
	);
	const shine = `0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 1 0 ${-128 / 255}`;
</script>

<svg class="absolute size-0" aria-hidden="true">
	<filter
		{id}
		filterUnits="objectBoundingBox"
		primitiveUnits="objectBoundingBox"
		color-interpolation-filters="sRGB"
		x="0"
		y="0"
		width="1"
		height="1"
	>
		<feFlood flood-color="rgb(128,128,128)" result="neutral" />
		<feImage
			href={map}
			x={hx / boxW}
			y={hy / boxH}
			width={w / boxW}
			height={h / boxH}
			preserveAspectRatio="none"
			result="raw"
		/>
		<feComposite in="raw" in2="neutral" operator="over" result="map0" />
		<feColorMatrix in="map0" values={shrink} result="map" />
		{#each channels as [c, values, result] (result)}
			<feDisplacementMap
				in="SourceGraphic"
				in2="map"
				scale={scale * px * (1 + c * chroma)}
				xChannelSelector="R"
				yChannelSelector="G"
			/>
			<feColorMatrix {values} {result} />
		{/each}
		<feComposite in="r" in2="g" operator="arithmetic" k2="1" k3="1" result="rg" />
		<feComposite in="rg" in2="b" operator="arithmetic" k2="1" k3="1" result="lens" />
		{#if dark}
			<feColorMatrix in="map" values={shine} result="specular" />
			<feComposite in="specular" in2="lens" operator="arithmetic" k2={specular} k3="1" />
		{:else}
			<feColorMatrix in="map" values={shade} result="specular" />
			<feComposite in="specular" in2="lens" operator="arithmetic" k1="1" />
		{/if}
	</filter>
</svg>
<div
	class="pointer-events-none absolute overflow-hidden"
	style:left="{x - boxW / 2}px"
	style:top="{y - boxH / 2}px"
	style:width="{boxW}px"
	style:height="{boxH}px"
	bind:this={host}
	style:background={background ?? detected}
	style:filter="url(#{id})"
	style:clip-path="inset({hy}px {hx}px round {radius}px)"
	aria-hidden="true"
>
	<div
		class="absolute"
		style:left="{boxW / 2 - x}px"
		style:top="{boxH / 2 - y}px"
		style:width="{width}px"
		style:height="{height}px"
	>
		{@render children()}
	</div>
</div>

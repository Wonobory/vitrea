<script lang="ts">
	import { cubicOut } from "svelte/easing";
	import { MediaQuery } from "svelte/reactivity";
	import { springXSmall } from "$lib/springs";
	import { cn } from "$lib/utils.js";
	import { digitSlot } from "$lib/transitions";

	type Props = {
		value: number;
		/** How the number is written (currency, %, units…). Defaults to grouped digits. */
		format?: (n: number) => string;
		class?: string;
	};
	let { value, format = (n) => n.toLocaleString("en-GB"), class: className }: Props = $props();

	const reduced = new MediaQuery("prefers-reduced-motion: reduce");

	// svelte-ignore state_referenced_locally
	let previous = value;
	let dir = $state(1);
	$effect.pre(() => {
		if (value !== previous) {
			dir = value > previous ? 1 : -1;
			previous = value;
		}
	});

	const text = $derived(format(value));
	const slots = $derived(
		[...text].map((ch, i, all) => ({ ch, key: all.length - 1 - i, digit: /\d/.test(ch) }))
	);

	const ROWS = 21;
	const MID = 10;
	const ROLL = 450;
	const rows = Array.from({ length: ROWS }, (_, i) => i);

	const roll = (col: HTMLElement, digit: number) => {
		const cells = [...col.children] as HTMLElement[];
		let cur = MID;
		let target = MID;
		let raf = 0;
		const paint = () => (col.style.translate = `0 ${(-cur * 100) / ROWS}%`);
		const settle = () => {
			cells[MID]!.textContent = cells[target]!.textContent;
			cur = target = MID;
			paint();
		};
		cells[MID]!.textContent = String(digit);
		paint();

		return {
			update(next: number) {
				if (cells[target]!.textContent === String(next)) return;
				let to =
					dir > 0
						? Math.floor(cur) + 1 + (Number.isInteger(cur) ? 0 : 1)
						: Math.ceil(cur) - 1 - (Number.isInteger(cur) ? 0 : 1);
				if (to < 1 || to > ROWS - 2) {
					const k = Math.round(cur) - MID;
					const seen = [];
					for (
						let r = Math.max(0, Math.floor(cur) - 1);
						r <= Math.min(ROWS - 1, Math.ceil(cur) + 1);
						r++
					)
						seen.push([r, cells[r]!.textContent] as const);
					for (const [r, t] of seen) cells[r - k]!.textContent = t;
					cur -= k;
					to -= k;
					paint();
				}
				cells[to]!.textContent = String(next);
				target = to;
				cancelAnimationFrame(raf);
				if (reduced.current) return settle();
				const from = cur;
				const distance = target - from;
				const last = Math.sign(distance) * Math.min(1, Math.abs(distance));
				const t0 = performance.now();
				const frame = (now: number) => {
					const k = Math.min(1, (now - t0) / ROLL);
					cur = from + (distance - last) * cubicOut(Math.min(1, k / 0.5)) + last * springXSmall(k);
					paint();
					if (k < 1) raf = requestAnimationFrame(frame);
					else settle();
				};
				raf = requestAnimationFrame(frame);
			},
			destroy() {
				cancelAnimationFrame(raf);
			},
		};
	};
</script>

<span class={cn(["inline-flex tabular-nums", className])}>
	<span class="sr-only">{text}</span>
	<span class="inline-flex" aria-hidden="true">
		{#each slots as slot (slot.key)}
			<span
				class="inline-grid h-1lh justify-items-center overflow-clip"
				in:digitSlot={{ going: false, dir }}
				out:digitSlot={{ going: true, dir }}
			>
				{#if slot.digit}
					<span class="flex flex-col" use:roll={Number(slot.ch)}>
						{#each rows as r (r)}<span>0</span>{/each}
					</span>
				{:else}
					<span class="whitespace-pre">{slot.ch}</span>
				{/if}
			</span>
		{/each}
	</span>
</span>

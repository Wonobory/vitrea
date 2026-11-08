<script lang="ts">
	import * as Carousel from "$lib/components/ui/carousel";

	const slides = [
		["Living room", "from-sky-400 to-indigo-600"],
		["Kitchen", "from-amber-300 to-orange-600"],
		["Bedroom", "from-emerald-300 to-teal-700"],
		["Terrace", "from-fuchsia-400 to-purple-700"],
	];
</script>

<div class="mx-auto w-full max-w-xs px-12">
	<Carousel.Root opts={{ loop: true }}>
		<Carousel.Content>
			{#each slides as [label, bg] (label)}
				<Carousel.Item>
					<div
						class="flex aspect-square items-end rounded-xl bg-gradient-to-br {bg} p-4 text-lg font-semibold text-white"
					>
						{label}
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
		<Carousel.Dots />
	</Carousel.Root>
</div>

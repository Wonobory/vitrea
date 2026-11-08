<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import HeartIcon from "@lucide/svelte/icons/heart";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
</script>

<div class="flex flex-col items-center gap-6">
	<div class="flex flex-wrap items-center justify-center gap-3">
		<Button>Get started <ArrowRightIcon /></Button>
		<Button variant="outline">Outline</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="destructive">Delete</Button>
		<Button variant="link">Link</Button>
	</div>
	<div class="flex flex-wrap items-center justify-center gap-3">
		<Button size="sm">Small</Button>
		<Button size="lg">Large</Button>
		<Button size="icon" aria-label="Add"><PlusIcon /></Button>
		<Button variant="outline" size="icon" aria-label="Like"><HeartIcon /></Button>
		<Button disabled>Disabled</Button>
	</div>
</div>

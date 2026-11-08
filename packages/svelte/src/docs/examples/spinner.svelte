<script lang="ts">
	import { Spinner } from "$lib/components/ui/spinner";
	import { Button } from "$lib/components/ui/button";
</script>

<div class="flex flex-wrap items-center justify-center gap-6">
	<Spinner />
	<Spinner class="size-6" />
	<Button disabled><Spinner /> Loading…</Button>
	<Button variant="outline" disabled><Spinner /> Saving</Button>
</div>

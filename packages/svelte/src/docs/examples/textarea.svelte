<script lang="ts">
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";
</script>

<div class="mx-auto grid max-w-sm gap-2">
	<Label for="note">Private note</Label>
	<Textarea id="note" placeholder="Visited on Saturday, the façade needs work…" />
</div>

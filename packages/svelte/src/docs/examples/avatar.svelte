<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
</script>

<div class="flex flex-wrap items-center justify-center gap-6">
	<Avatar.Root size="sm"><Avatar.Fallback>OR</Avatar.Fallback></Avatar.Root>
	<Avatar.Root><Avatar.Fallback>AL</Avatar.Fallback></Avatar.Root>
	<Avatar.Root size="lg"><Avatar.Fallback>MG</Avatar.Fallback></Avatar.Root>
	<Avatar.Group>
		<Avatar.Root><Avatar.Fallback>JS</Avatar.Fallback></Avatar.Root>
		<Avatar.Root><Avatar.Fallback>PB</Avatar.Fallback></Avatar.Root>
		<Avatar.Root><Avatar.Fallback>CT</Avatar.Fallback></Avatar.Root>
		<Avatar.GroupCount>+4</Avatar.GroupCount>
	</Avatar.Group>
</div>

<script lang="ts">
	import * as NativeSelect from "$lib/components/ui/native-select";

	let value = $state("ending");
</script>

<div class="flex justify-center">
	<NativeSelect.Root bind:value class="w-52">
		<NativeSelect.Option value="ending">Ending soon</NativeSelect.Option>
		<NativeSelect.Option value="new">Newest</NativeSelect.Option>
		<NativeSelect.OptGroup label="Price">
			<NativeSelect.Option value="low">Lowest first</NativeSelect.Option>
			<NativeSelect.Option value="high">Highest first</NativeSelect.Option>
		</NativeSelect.OptGroup>
	</NativeSelect.Root>
</div>

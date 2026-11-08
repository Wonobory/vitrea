<script lang="ts">
	import * as ContextMenu from "$lib/components/ui/context-menu";
</script>

<div class="flex justify-center">
	<ContextMenu.Root>
		<ContextMenu.Trigger
			class="grid h-40 w-72 place-items-center rounded-xl border border-dashed text-sm text-muted-foreground"
		>
			Right-click here
		</ContextMenu.Trigger>
		<ContextMenu.Content class="w-56">
			<ContextMenu.Item
				>Open listing <ContextMenu.Shortcut>⏎</ContextMenu.Shortcut></ContextMenu.Item
			>
			<ContextMenu.Item>Follow</ContextMenu.Item>
			<ContextMenu.Item>Copy link <ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut></ContextMenu.Item>
			<ContextMenu.Separator />
			<ContextMenu.Sub>
				<ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
				<ContextMenu.SubContent>
					<ContextMenu.Item>Email</ContextMenu.Item>
					<ContextMenu.Item>WhatsApp</ContextMenu.Item>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>
			<ContextMenu.Separator />
			<ContextMenu.Item variant="destructive">Hide</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>
</div>

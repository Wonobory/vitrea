<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
</script>

<div class="flex justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item><Breadcrumb.Link href="#">Auctions</Breadcrumb.Link></Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item><Breadcrumb.Link href="#">Barcelona</Breadcrumb.Link></Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item><Breadcrumb.Page>Flat in Gràcia</Breadcrumb.Page></Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>

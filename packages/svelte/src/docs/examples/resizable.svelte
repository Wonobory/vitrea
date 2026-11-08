<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable";
</script>

<Resizable.PaneGroup direction="horizontal" class="mx-auto min-h-56 max-w-lg rounded-xl border">
  <Resizable.Pane defaultSize={40}>
    <div class="flex h-full items-center justify-center p-6 text-sm font-medium">List</div>
  </Resizable.Pane>
  <Resizable.Handle withHandle />
  <Resizable.Pane defaultSize={60}>
    <Resizable.PaneGroup direction="vertical">
      <Resizable.Pane defaultSize={55}>
        <div class="flex h-full items-center justify-center p-6 text-sm font-medium">Map</div>
      </Resizable.Pane>
      <Resizable.Handle withHandle />
      <Resizable.Pane defaultSize={45}>
        <div class="flex h-full items-center justify-center p-6 text-sm font-medium">Details</div>
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </Resizable.Pane>
</Resizable.PaneGroup>

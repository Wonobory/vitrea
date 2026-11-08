<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar";

  let layers = $state({ parcels: true, buildings: false });
  let base = $state("map");
</script>

<div class="flex justify-center">
  <Menubar.Root>
    <Menubar.Menu>
      <Menubar.Trigger>File</Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Item>New alert <Menubar.Shortcut>⌘N</Menubar.Shortcut></Menubar.Item>
        <Menubar.Item>Print listing <Menubar.Shortcut>⌘P</Menubar.Shortcut></Menubar.Item>
      </Menubar.Content>
    </Menubar.Menu>
    <Menubar.Menu>
      <Menubar.Trigger>View</Menubar.Trigger>
      <Menubar.Content>
        <Menubar.CheckboxItem bind:checked={layers.parcels}>Parcels</Menubar.CheckboxItem>
        <Menubar.CheckboxItem bind:checked={layers.buildings}>3D buildings</Menubar.CheckboxItem>
        <Menubar.Separator />
        <Menubar.RadioGroup bind:value={base}>
          <Menubar.RadioItem value="map">Map</Menubar.RadioItem>
          <Menubar.RadioItem value="satellite">Satellite</Menubar.RadioItem>
        </Menubar.RadioGroup>
      </Menubar.Content>
    </Menubar.Menu>
    <Menubar.Menu>
      <Menubar.Trigger>Help</Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Item>Guide</Menubar.Item>
        <Menubar.Item>Keyboard shortcuts</Menubar.Item>
      </Menubar.Content>
    </Menubar.Menu>
  </Menubar.Root>
</div>

<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

  let sort = $state("ending");
  let onlyNew = $state(true);
</script>

<div class="flex justify-center">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Sort <ChevronDownIcon /></Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-56">
      <DropdownMenu.Group>
        <DropdownMenu.Label>Sort by</DropdownMenu.Label>
        <DropdownMenu.RadioGroup bind:value={sort}>
          <DropdownMenu.RadioItem value="ending">Ending soon</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="discount">Biggest discount</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="price">Lowest price</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem bind:checked={onlyNew}>Only new this week</DropdownMenu.CheckboxItem>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>Reset <DropdownMenu.Shortcut>⌘R</DropdownMenu.Shortcut></DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>

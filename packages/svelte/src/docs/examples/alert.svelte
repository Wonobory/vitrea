<script lang="ts">
  import * as Alert from "$lib/components/ui/alert";
  import { Button } from "$lib/components/ui/button";
  import FileSearchIcon from "@lucide/svelte/icons/file-search";
  import KeyRoundIcon from "@lucide/svelte/icons/key-round";
  import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
  import BellRingIcon from "@lucide/svelte/icons/bell-ring";
  import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";

  let saved = $state(true);
  let occupied = $state(true);
</script>

<div class="mx-auto w-full max-w-md space-y-3">
  <Alert.Root variant="info">
    <FileSearchIcon />
    <Alert.Title>We read 6 documents</Alert.Title>
    <Alert.Description>No charges survive the auction. The mortgage being enforced is cancelled on award.</Alert.Description>
  </Alert.Root>

  <Alert.Root variant="warning">
    <KeyRoundIcon />
    <Alert.Title>Rented, and the lease survives</Alert.Title>
    <Alert.Description>A 2019 lease at €650/month predates the mortgage, so the tenant can stay.</Alert.Description>
    <Alert.Action>
      <Button variant="outline" size="sm">See in the document <ArrowRightIcon /></Button>
    </Alert.Action>
  </Alert.Root>

  {#if occupied}
    <Alert.Root variant="destructive" onclose={() => (occupied = false)}>
      <TriangleAlertIcon />
      <Alert.Title>Occupied by a third party</Alert.Title>
      <Alert.Description>The edict says someone lives there without a right to stay. Eviction is on the buyer.</Alert.Description>
    </Alert.Root>
  {/if}

  {#if saved}
    <Alert.Root variant="success" onclose={() => (saved = false)}>
      <BellRingIcon />
      <Alert.Title>Alert saved</Alert.Title>
      <Alert.Description>We'll email you when a flat in Valencia under €150k is published.</Alert.Description>
    </Alert.Root>
  {/if}

  {#if !saved || !occupied}
    <Button
      variant="ghost"
      size="sm"
      class="mx-auto flex"
      onclick={() => {
        saved = true;
        occupied = true;
      }}>Show them again</Button
    >
  {/if}
</div>

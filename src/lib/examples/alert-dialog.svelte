<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button";
</script>

<div class="flex justify-center">
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Delete alert</Button>
      {/snippet}
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Delete this alert?</AlertDialog.Title>
        <AlertDialog.Description>
          You'll stop receiving emails for “Flats in Valencia under €150k”. This can't be undone.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Keep it</AlertDialog.Cancel>
        <AlertDialog.Action variant="destructive">Delete</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>

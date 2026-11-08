<script lang="ts">
  import { Ticker } from "$lib/components/ui/ticker";
  import * as Drawer from "$lib/components/ui/drawer";
  import { Button } from "$lib/components/ui/button";

  let bid = $state(120_000);
  const eur = (n: number) => n.toLocaleString("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
</script>

<div class="flex justify-center">
  <Drawer.Root>
    <Drawer.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Plan your bid</Button>
      {/snippet}
    </Drawer.Trigger>
    <Drawer.Content>
      <div class="mx-auto w-full max-w-sm">
        <Drawer.Header>
          <Drawer.Title>Your bid</Drawer.Title>
          <Drawer.Description>Adjust in steps of €5,000.</Drawer.Description>
        </Drawer.Header>
        <div class="flex items-center justify-center gap-4 p-4">
          <Button variant="outline" size="icon" onclick={() => (bid -= 5000)} aria-label="Lower">−</Button>
          <div class="w-40 text-center font-display text-4xl font-semibold"><Ticker value={bid} format={eur} /></div>
          <Button variant="outline" size="icon" onclick={() => (bid += 5000)} aria-label="Raise">+</Button>
        </div>
        <Drawer.Footer>
          <Button>Save</Button>
          <Drawer.Close>
            {#snippet child({ props })}
              <Button {...props} variant="outline">Cancel</Button>
            {/snippet}
          </Drawer.Close>
        </Drawer.Footer>
      </div>
    </Drawer.Content>
  </Drawer.Root>
</div>

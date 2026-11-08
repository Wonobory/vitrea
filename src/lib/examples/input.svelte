<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
</script>

<div class="mx-auto grid max-w-sm gap-4">
  <div class="grid gap-2">
    <Label for="email">Email</Label>
    <Input id="email" type="email" placeholder="you@example.com" />
  </div>
  <Input type="file" />
  <Input disabled placeholder="Disabled" />
</div>

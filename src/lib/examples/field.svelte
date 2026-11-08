<script lang="ts">
  import * as Field from "$lib/components/ui/field";
  import { Input } from "$lib/components/ui/input";
  import { Switch } from "$lib/components/ui/switch";
  import { Button } from "$lib/components/ui/button";
</script>

<form class="mx-auto max-w-sm" onsubmit={(e) => e.preventDefault()}>
  <Field.Set>
    <Field.Legend>New alert</Field.Legend>
    <Field.Description>We'll email you when a matching property comes up.</Field.Description>
    <Field.Group>
      <Field.Field>
        <Field.Label for="zone">Area</Field.Label>
        <Input id="zone" placeholder="Valencia" />
      </Field.Field>
      <Field.Field data-invalid="true">
        <Field.Label for="max">Max price</Field.Label>
        <Input id="max" value="-5" aria-invalid="true" />
        <Field.Error>Enter a positive amount.</Field.Error>
      </Field.Field>
      <Field.Separator />
      <Field.Field orientation="horizontal">
        <Field.Content>
          <Field.Label for="daily">Daily digest</Field.Label>
          <Field.Description>One email a day instead of one per match.</Field.Description>
        </Field.Content>
        <Switch id="daily" />
      </Field.Field>
      <Button type="submit">Create alert</Button>
    </Field.Group>
  </Field.Set>
</form>

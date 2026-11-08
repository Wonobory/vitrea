<script lang="ts">
	import * as Accordion from "$lib/components/ui/accordion";
</script>

<Accordion.Root type="single" class="mx-auto w-full max-w-md" value="deposit">
	<Accordion.Item value="deposit">
		<Accordion.Trigger>How much is the deposit?</Accordion.Trigger>
		<Accordion.Content
			>Usually 5% of the appraised value, returned if you don't win.</Accordion.Content
		>
	</Accordion.Item>
	<Accordion.Item value="charges">
		<Accordion.Trigger>Do existing charges survive?</Accordion.Trigger>
		<Accordion.Content
			>Charges ranking ahead of the one being enforced usually do. Read the registry certificate.</Accordion.Content
		>
	</Accordion.Item>
	<Accordion.Item value="keys">
		<Accordion.Trigger>When do I get the keys?</Accordion.Trigger>
		<Accordion.Content
			>After the sale is approved and the price paid; possession may take longer if occupied.</Accordion.Content
		>
	</Accordion.Item>
</Accordion.Root>

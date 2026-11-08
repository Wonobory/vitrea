<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import {
		buttonVariants,
		type ButtonVariant,
		type ButtonSize,
	} from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import { press } from "$lib/press";

	let {
		ref = $bindable(null),
		class: className,
		variant = "outline",
		size = "default",
		children,
		...restProps
	}: AlertDialogPrimitive.CancelProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
	} = $props();
</script>

<AlertDialogPrimitive.Cancel bind:ref data-slot="alert-dialog-cancel" {...restProps}>
	{#snippet child({ props })}
		<button
			{...props}
			use:press={variant === "default" || variant === "outline" || variant === "ghost" || variant === "destructive"}
			class={cn(buttonVariants({ variant, size }), className)}
		>
			{@render children?.()}
		</button>
	{/snippet}
</AlertDialogPrimitive.Cancel>

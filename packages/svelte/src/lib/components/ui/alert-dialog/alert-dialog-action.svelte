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
		variant = "default",
		size = "default",
		children,
		...restProps
	}: AlertDialogPrimitive.ActionProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
	} = $props();
</script>

<AlertDialogPrimitive.Action bind:ref data-slot="alert-dialog-action" {...restProps}>
	{#snippet child({ props })}
		<button
			{...props}
			use:press={variant === "default" || variant === "outline" || variant === "ghost" || variant === "destructive"}
			class={cn(buttonVariants({ variant, size }), className)}
		>
			{@render children?.()}
		</button>
	{/snippet}
</AlertDialogPrimitive.Action>

<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const alertVariants = tv({
		base: [
			"group/alert relative grid w-full gap-0.5 overflow-hidden rounded-xl border px-4 py-3.5 text-left text-sm",
			"border-[color-mix(in_oklab,var(--tone)_28%,var(--border))]",
			"bg-[linear-gradient(90deg,color-mix(in_oklab,var(--tone)_9%,var(--panel)),var(--panel)_65%)]",
			"has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-3 *:[svg]:size-8 *:[svg]:rounded-lg *:[svg]:p-[7px] *:[svg]:text-(--tone)",
			"*:[svg]:bg-[color-mix(in_oklab,var(--tone)_12%,transparent)] *:[svg]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--tone)_18%,transparent)]",
			"has-data-[slot=alert-close]:pr-11",
		],
		variants: {
			variant: {
				default: "[--tone:var(--muted-foreground)] text-card-foreground",
				info: "[--tone:var(--primary)] *:data-[slot=alert-title]:text-foreground",
				success: "[--tone:var(--success)] *:data-[slot=alert-title]:text-success",
				warning: "[--tone:var(--warning)] *:data-[slot=alert-title]:text-warning",
				destructive: "[--tone:var(--danger)] *:data-[slot=alert-title]:text-danger",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type AlertVariant = VariantProps<typeof alertVariants>["variant"];
</script>

<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import { fold } from "$lib/transitions";
	import XIcon from "@lucide/svelte/icons/x";
	import { press } from "$lib/press";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		onclose,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: AlertVariant;
		/** Shows a close button. Remove the alert in it and it folds away. */
		onclose?: () => void;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="alert"
	role={variant === "destructive" || variant === "warning" ? "alert" : "status"}
	class={cn([alertVariants({ variant }), className])}
	transition:fold
	{...restProps}
>
	{@render children?.()}
	{#if onclose}
		<button
			type="button"
			data-slot="alert-close"
			use:press
			onclick={onclose}
			aria-label="Dismiss"
			class="glass-ghost absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4"
		>
			<XIcon />
		</button>
	{/if}
</div>

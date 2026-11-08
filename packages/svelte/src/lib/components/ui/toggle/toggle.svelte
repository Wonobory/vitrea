<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	/** Layout only: the glass depends on the pressed state (see below). */
	export const toggleVariants = tv({
		base: "group/toggle inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground aria-pressed:text-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				default: "",
				outline: "",
			},
			size: {
				default: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
				sm: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
				lg: "h-10 min-w-10 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	/**
	 * Glass for a toggle, like Pujarr's "Follow" button: `default` is a ghost
	 * that turns to neutral glass when on; `outline` is always neutral glass.
	 * On, `.glass-neutral[aria-pressed=true]` deepens the veil (app.css).
	 */
	export const glassToggle = (variant: ToggleVariant, pressed: boolean) =>
		variant === "outline" || pressed ? "glass-neutral" : "glass-ghost";

	export type ToggleVariant = VariantProps<typeof toggleVariants>["variant"];
	export type ToggleSize = VariantProps<typeof toggleVariants>["size"];
	export type ToggleVariants = VariantProps<typeof toggleVariants>;
</script>

<script lang="ts">
	import { Toggle as TogglePrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { press } from "$lib/press";

	let {
		ref = $bindable(null),
		pressed = $bindable(false),
		class: className,
		size = "default",
		variant = "default",
		children,
		...restProps
	}: TogglePrimitive.RootProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();
</script>

<TogglePrimitive.Root bind:ref bind:pressed data-slot="toggle" {...restProps}>
	{#snippet child({ props, pressed })}
		<button {...props} use:press class={cn(toggleVariants({ variant, size }), glassToggle(variant, pressed), className)}>
			{@render children?.({ pressed })}
		</button>
	{/snippet}
</TogglePrimitive.Root>

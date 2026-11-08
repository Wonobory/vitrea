<script lang="ts" module>
  import { type VariantProps, tv } from "tailwind-variants";

  // Tinted glass capsules: the variant only picks `--tone`; `.badge-tinted`
  // (below) mixes it into the fill, the border, the text and the glow.
  export const badgeVariants = tv({
    base: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:ring-[3px] [&>svg]:pointer-events-none",
    variants: {
      variant: {
        default: "glass-fill",
        secondary: "badge-tinted [--tone:var(--muted-foreground)]",
        info: "badge-tinted [--tone:var(--primary)]",
        success: "badge-tinted [--tone:var(--success)]",
        warning: "badge-tinted [--tone:var(--warning)]",
        destructive: "badge-tinted [--tone:var(--danger)]",
        outline: "border-border text-foreground [a]:hover:bg-muted",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "../../../utils.js";

  let {
    ref = $bindable(null),
    href,
    class: className,
    variant = "default",
    dot = false,
    children,
    ...restProps
  }: WithElementRef<HTMLAnchorAttributes> & {
    variant?: BadgeVariant;
    /** A status dot before the label; `"pulse"` adds a ring that keeps beating (live, in progress). */
    dot?: boolean | "pulse";
  } = $props();
</script>

<svelte:element
  this={href ? "a" : "span"}
  bind:this={ref}
  data-slot="badge"
  {href}
  class={cn(badgeVariants({ variant }), dot && "pl-1.5", className)}
  {...restProps}
>
  {#if dot}
    <span class={["badge-dot", dot === "pulse" && "badge-pulse"]} aria-hidden="true"></span>
  {/if}
  {@render children?.()}
</svelte:element>

<style>
  :global(.badge-tinted) {
    color: color-mix(in oklab, var(--tone) 82%, var(--foreground));
    border-color: color-mix(in oklab, var(--tone) 26%, transparent);
    background:
      linear-gradient(rgb(255 255 255 / 0.4), transparent 70%),
      color-mix(in oklab, var(--tone) 12%, var(--card));
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.55),
      0 1px 2px color-mix(in oklab, var(--tone) 20%, transparent);
  }
  :global(.dark .badge-tinted) {
    color: color-mix(in oklab, var(--tone) 70%, white);
    background:
      linear-gradient(rgb(255 255 255 / 0.07), transparent 70%),
      color-mix(in oklab, var(--tone) 18%, var(--card));
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.12),
      0 1px 2px rgb(0 0 0 / 0.3);
  }
  :global(a.badge-tinted:hover) {
    background:
      linear-gradient(rgb(255 255 255 / 0.4), transparent 70%),
      color-mix(in oklab, var(--tone) 20%, var(--card));
  }

  .badge-dot {
    position: relative;
    flex: none;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    background: currentColor;
  }
  .badge-pulse::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    animation: badge-ping 1.6s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
  }
  @keyframes badge-ping {
    from {
      transform: scale(1);
      opacity: 0.6;
    }
    to {
      transform: scale(2.8);
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .badge-pulse::after {
      animation: none;
    }
  }
</style>

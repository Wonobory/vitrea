import { type WithElementRef } from "../../../utils.js";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import { type VariantProps } from "tailwind-variants";
export declare const buttonVariants: import("tailwind-variants").TVReturnType<{
    variant: {
        default: "glass-fill border-0 dark:border";
        outline: "glass-neutral";
        secondary: "glass-neutral text-primary [--glass-veil:color-mix(in_oklab,var(--primary)_12%,transparent)] [--glass-veil-over:color-mix(in_oklab,var(--primary)_18%,transparent)]";
        ghost: "glass-ghost";
        destructive: "glass-fill border-0 dark:border [--tone:var(--danger)] dark:[--tone:oklch(0.55_0.2_25)]";
        link: "text-primary underline-offset-4 hover:underline";
    };
    size: {
        default: "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2";
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3";
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5";
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2";
        icon: "size-9";
        "icon-xs": "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3";
        "icon-sm": "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md";
        "icon-lg": "size-10";
    };
}, undefined, "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0", {
    variant: {
        default: "glass-fill border-0 dark:border";
        outline: "glass-neutral";
        secondary: "glass-neutral text-primary [--glass-veil:color-mix(in_oklab,var(--primary)_12%,transparent)] [--glass-veil-over:color-mix(in_oklab,var(--primary)_18%,transparent)]";
        ghost: "glass-ghost";
        destructive: "glass-fill border-0 dark:border [--tone:var(--danger)] dark:[--tone:oklch(0.55_0.2_25)]";
        link: "text-primary underline-offset-4 hover:underline";
    };
    size: {
        default: "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2";
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3";
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5";
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2";
        icon: "size-9";
        "icon-xs": "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3";
        "icon-sm": "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md";
        "icon-lg": "size-10";
    };
}, undefined, import("tailwind-variants").TVReturnTypeLike<{
    variant: {
        default: "glass-fill border-0 dark:border";
        outline: "glass-neutral";
        secondary: "glass-neutral text-primary [--glass-veil:color-mix(in_oklab,var(--primary)_12%,transparent)] [--glass-veil-over:color-mix(in_oklab,var(--primary)_18%,transparent)]";
        ghost: "glass-ghost";
        destructive: "glass-fill border-0 dark:border [--tone:var(--danger)] dark:[--tone:oklch(0.55_0.2_25)]";
        link: "text-primary underline-offset-4 hover:underline";
    };
    size: {
        default: "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2";
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3";
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5";
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2";
        icon: "size-9";
        "icon-xs": "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3";
        "icon-sm": "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md";
        "icon-lg": "size-10";
    };
}, undefined>>;
export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
export type ButtonSize = VariantProps<typeof buttonVariants>["size"];
export type ButtonProps = WithElementRef<HTMLButtonAttributes> & WithElementRef<HTMLAnchorAttributes> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};
declare const Button: import("svelte").Component<ButtonProps, {}, "ref">;
type Button = ReturnType<typeof Button>;
export default Button;

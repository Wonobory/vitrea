import { type VariantProps } from "tailwind-variants";
/**
 * Each variant sets one `--tone`; border, the wash from the left, the icon
 * tile and the title all come from it. A panel, not glass: an alert is
 * something you read, not something you press.
 */
export declare const alertVariants: import("tailwind-variants").TVReturnType<{
    variant: {
        default: "[--tone:var(--muted-foreground)] text-card-foreground";
        info: "[--tone:var(--primary)] *:data-[slot=alert-title]:text-foreground";
        success: "[--tone:var(--success)] *:data-[slot=alert-title]:text-success";
        warning: "[--tone:var(--warning)] *:data-[slot=alert-title]:text-warning";
        destructive: "[--tone:var(--danger)] *:data-[slot=alert-title]:text-danger";
    };
}, undefined, string[], {
    variant: {
        default: "[--tone:var(--muted-foreground)] text-card-foreground";
        info: "[--tone:var(--primary)] *:data-[slot=alert-title]:text-foreground";
        success: "[--tone:var(--success)] *:data-[slot=alert-title]:text-success";
        warning: "[--tone:var(--warning)] *:data-[slot=alert-title]:text-warning";
        destructive: "[--tone:var(--danger)] *:data-[slot=alert-title]:text-danger";
    };
}, undefined, import("tailwind-variants").TVReturnTypeLike<{
    variant: {
        default: "[--tone:var(--muted-foreground)] text-card-foreground";
        info: "[--tone:var(--primary)] *:data-[slot=alert-title]:text-foreground";
        success: "[--tone:var(--success)] *:data-[slot=alert-title]:text-success";
        warning: "[--tone:var(--warning)] *:data-[slot=alert-title]:text-warning";
        destructive: "[--tone:var(--danger)] *:data-[slot=alert-title]:text-danger";
    };
}, undefined>>;
export type AlertVariant = VariantProps<typeof alertVariants>["variant"];
import type { HTMLAttributes } from "svelte/elements";
import { type WithElementRef } from "../../../utils.js";
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: AlertVariant;
    /** Shows a close button. Remove the alert in it and it folds away. */
    onclose?: () => void;
};
declare const Alert: import("svelte").Component<$$ComponentProps, {}, "ref">;
type Alert = ReturnType<typeof Alert>;
export default Alert;

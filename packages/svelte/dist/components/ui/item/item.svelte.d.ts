import { type VariantProps } from "tailwind-variants";
export declare const itemVariants: import("tailwind-variants").TVReturnType<{
    variant: {
        default: "border-transparent";
        outline: "border-border bg-panel";
        muted: "bg-muted/50 border-transparent";
    };
    size: {
        default: "gap-3.5 px-4 py-3.5";
        sm: "gap-2.5 px-3 py-2.5";
        xs: "gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0";
    };
}, undefined, "[a]:hover:bg-muted/60 rounded-lg border text-sm group/item focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors", {
    variant: {
        default: "border-transparent";
        outline: "border-border bg-panel";
        muted: "bg-muted/50 border-transparent";
    };
    size: {
        default: "gap-3.5 px-4 py-3.5";
        sm: "gap-2.5 px-3 py-2.5";
        xs: "gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0";
    };
}, undefined, import("tailwind-variants").TVReturnTypeLike<{
    variant: {
        default: "border-transparent";
        outline: "border-border bg-panel";
        muted: "bg-muted/50 border-transparent";
    };
    size: {
        default: "gap-3.5 px-4 py-3.5";
        sm: "gap-2.5 px-3 py-2.5";
        xs: "gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0";
    };
}, undefined>>;
export type ItemSize = VariantProps<typeof itemVariants>["size"];
export type ItemVariant = VariantProps<typeof itemVariants>["variant"];
import { type WithElementRef } from "../../../utils.js";
import type { HTMLAttributes } from "svelte/elements";
import type { Snippet } from "svelte";
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    child?: Snippet<[{
        props: Record<string, unknown>;
    }]>;
    variant?: ItemVariant;
    size?: ItemSize;
};
declare const Item: import("svelte").Component<$$ComponentProps, {}, "ref">;
type Item = ReturnType<typeof Item>;
export default Item;

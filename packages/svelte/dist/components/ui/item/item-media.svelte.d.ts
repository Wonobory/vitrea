import { type VariantProps } from "tailwind-variants";
export declare const itemMediaVariants: import("tailwind-variants").TVReturnType<{
    variant: {
        default: "bg-transparent";
        icon: "size-9 rounded-md border bg-card text-muted-foreground group-data-[size=sm]/item:size-8 [&_svg:not([class*='size-'])]:size-4";
        image: "size-10 overflow-hidden rounded-md group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover";
    };
}, undefined, "gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start flex shrink-0 items-center justify-center [&_svg]:pointer-events-none", {
    variant: {
        default: "bg-transparent";
        icon: "size-9 rounded-md border bg-card text-muted-foreground group-data-[size=sm]/item:size-8 [&_svg:not([class*='size-'])]:size-4";
        image: "size-10 overflow-hidden rounded-md group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover";
    };
}, undefined, import("tailwind-variants").TVReturnTypeLike<{
    variant: {
        default: "bg-transparent";
        icon: "size-9 rounded-md border bg-card text-muted-foreground group-data-[size=sm]/item:size-8 [&_svg:not([class*='size-'])]:size-4";
        image: "size-10 overflow-hidden rounded-md group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover";
    };
}, undefined>>;
export type ItemMediaVariant = VariantProps<typeof itemMediaVariants>["variant"];
import { type WithElementRef } from "../../../utils.js";
import type { HTMLAttributes } from "svelte/elements";
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: ItemMediaVariant;
};
declare const ItemMedia: import("svelte").Component<$$ComponentProps, {}, "ref">;
type ItemMedia = ReturnType<typeof ItemMedia>;
export default ItemMedia;

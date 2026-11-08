import { type VariantProps } from "tailwind-variants";
/**
 * One glass capsule holding flat buttons, instead of glass buttons glued
 * together (each with its own rim and shadow, doubled at every joint).
 * The buttons inside drop their glass; a single piece slides to the one
 * under the pointer (`$lib/indicator`), as in menus.
 */
export declare const buttonGroupVariants: import("tailwind-variants").TVReturnType<{
    orientation: {
        horizontal: "";
        vertical: "flex-col";
    };
}, undefined, string[], {
    orientation: {
        horizontal: "";
        vertical: "flex-col";
    };
}, undefined, import("tailwind-variants").TVReturnTypeLike<{
    orientation: {
        horizontal: "";
        vertical: "flex-col";
    };
}, undefined>>;
export type ButtonGroupOrientation = VariantProps<typeof buttonGroupVariants>["orientation"];
import { type WithElementRef } from "../../../utils.js";
import type { HTMLAttributes } from "svelte/elements";
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    orientation?: ButtonGroupOrientation;
};
declare const ButtonGroup: import("svelte").Component<$$ComponentProps, {}, "ref">;
type ButtonGroup = ReturnType<typeof ButtonGroup>;
export default ButtonGroup;

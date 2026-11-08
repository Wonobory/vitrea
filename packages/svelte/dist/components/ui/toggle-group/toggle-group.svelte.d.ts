import type { VariantProps } from "tailwind-variants";
import { toggleVariants } from "../toggle/index.js";
type ToggleVariants = VariantProps<typeof toggleVariants>;
/** Selected glass, tinted with the brand (like the secondary button). */
export declare const TINT = "text-primary [--glass-veil:color-mix(in_oklab,var(--primary)_12%,transparent)] [--glass-veil-over:color-mix(in_oklab,var(--primary)_18%,transparent)]";
interface ToggleGroupContext extends ToggleVariants {
    spacing?: number;
    type?: "single" | "multiple";
    orientation?: "horizontal" | "vertical";
}
export declare function setToggleGroupCtx(props: ToggleGroupContext): void;
export declare function getToggleGroupCtx(): Required<ToggleGroupContext>;
import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
type $$ComponentProps = ToggleGroupPrimitive.RootProps & ToggleVariants & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
};
declare const ToggleGroup: import("svelte").Component<$$ComponentProps, {}, "ref" | "value">;
type ToggleGroup = ReturnType<typeof ToggleGroup>;
export default ToggleGroup;

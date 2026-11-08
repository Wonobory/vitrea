import { Tooltip as TooltipPrimitive } from "bits-ui";
import { type WithoutChildrenOrChild } from "../../../utils.js";
import TooltipPortal from "./tooltip-portal.svelte";
import type { ComponentProps } from "svelte";
type $$ComponentProps = TooltipPrimitive.ContentProps & {
    /** Kept for API compatibility: the arrow is the glass one (`GlassArrow`). */
    arrowClasses?: string;
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof TooltipPortal>>;
};
declare const TooltipContent: import("svelte").Component<$$ComponentProps, {}, "ref">;
type TooltipContent = ReturnType<typeof TooltipContent>;
export default TooltipContent;

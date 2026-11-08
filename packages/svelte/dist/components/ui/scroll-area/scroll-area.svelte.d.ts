import { ScrollArea as ScrollAreaPrimitive } from "bits-ui";
import { type WithoutChild } from "../../../utils.js";
type $$ComponentProps = WithoutChild<ScrollAreaPrimitive.RootProps> & {
    orientation?: "vertical" | "horizontal" | "both" | undefined;
    scrollbarXClasses?: string | undefined;
    scrollbarYClasses?: string | undefined;
    viewportRef?: HTMLElement | null;
    /** Fade the content out at an edge while there's more to scroll that way. */
    fade?: boolean;
    /** Drag the content with the mouse to scroll it, with momentum on release (touch already scrolls natively). */
    drag?: boolean;
};
declare const ScrollArea: import("svelte").Component<$$ComponentProps, {}, "ref" | "viewportRef">;
type ScrollArea = ReturnType<typeof ScrollArea>;
export default ScrollArea;

/**
     * A sprung switch. The knob is a white pill that grows past the track while
     * pressed, dragged or travelling, stretches with its speed, and settles back
     * when it lands.
     *
     * Drag it, or tap it. bits-ui keeps the role, keyboard and state; a drag
     * sets `checked` itself and swallows the click that follows.
     */
import { Switch as SwitchPrimitive } from "bits-ui";
import { type WithoutChildrenOrChild } from "../../../utils.js";
type $$ComponentProps = WithoutChildrenOrChild<SwitchPrimitive.RootProps> & {
    size?: "sm" | "default";
};
declare const Switch: import("svelte").Component<$$ComponentProps, {}, "ref" | "checked">;
type Switch = ReturnType<typeof Switch>;
export default Switch;

/**
     * Recessed track, glass-coloured range and a white knob that turns into
     * glass while dragged (or focused from the keyboard), like Aave's slider
     * (aave.com/design/building-glass-for-the-web): it grows with
     * `springSmall`, the button fades out and a copy of the track, thicker,
     * is bent under it by `Lens`. Moving fast makes it grow a little more.
     *
     * The copy is drawn from the value, with the same geometry bits-ui uses:
     * the knob's centre runs from half a knob (10 px) to width − 10 px.
     */
import { Slider as SliderPrimitive } from "bits-ui";
import { type WithoutChildrenOrChild } from "../../../utils.js";
declare const Slider: import("svelte").Component<WithoutChildrenOrChild<SliderPrimitive.RootProps>, {}, "ref" | "value">;
type Slider = ReturnType<typeof Slider>;
export default Slider;

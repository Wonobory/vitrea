/**
   * Two glass lenses drifting over a block (the same `Lens` as the range lens):
   *
   * - A big one in front, bending and slightly magnifying everything (`back`
   *   and `children`). It drifts on its own along a slow figure-of-eight; grab
   *   it with the mouse or a finger to carry it anywhere, and when you let go
   *   it picks up its path again from there. Moving, it deforms like a drop of
   *   liquid: it stretches along the motion and narrows across it (one
   *   underdamped spring per axis), so when it stops it wobbles into shape.
   * - A smaller one behind the text, bending only `back` (gradients, dots):
   *   the letters stay crisp on top of it.
   *
   * What the lenses show is a second, inert copy of the content, hidden from
   * assistive tech. With reduced motion both rest in place.
   */
import { type Snippet } from "svelte";
type $$ComponentProps = {
    /** The front layer (text, buttons). */
    children: Snippet;
    /** The layer behind it (backdrop). Only this is bent by the small lens. */
    back?: Snippet;
    /** Big lens size, in px. */
    w?: number;
    h?: number;
    /** Small lens diameter, in px. */
    small?: number;
    /** How much the content grows inside the big lens. */
    magnify?: number;
    /** What sits behind the content (the copies inside the lenses are opaque). */
    background?: string;
    class?: string;
};
declare const CursorLens: import("svelte").Component<$$ComponentProps, {}, "">;
type CursorLens = ReturnType<typeof CursorLens>;
export default CursorLens;

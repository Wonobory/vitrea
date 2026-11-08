/**
   * A glass lens like Aave's
   * (aave.com/design/building-glass-for-the-web): a copy of what's
   * underneath (`children`), clipped to the lens and warped with
   * `feDisplacementMap`, with chromatic aberration and a specular highlight.
   * The map comes from `$lib/glass`. Used by `BidBar` and `Segmented`.
   *
   * The copy is only the lens box (plus slack), with the content offset
   * inside, and the filter works in fractions of that box
   * (`objectBoundingBox`): Safari won't paint a `userSpaceOnUse` filter on
   * HTML, and with a very wide box each engine read `scale` differently. What
   * remains of the difference between axes is evened out by a colour matrix
   * that shrinks one channel of the map, as Aave does.
   *
   * It doesn't paint the glass rim or shadow: each caller puts its own on
   * top, since they depend on its shape and on whether the glass is at rest.
   */
import { type Snippet } from "svelte";
import { type GlassParams } from "../../glass";
type Props = {
    /** Lens centre, in px of the container `children` is a copy of. */
    x: number;
    y: number;
    /** Current lens size and radius. */
    w: number;
    h: number;
    radius: number;
    /** The shape the map is painted for (`feImage` stretches it to the current one). */
    shape: {
        w: number;
        h: number;
        radius: number;
    };
    glass: Record<"light" | "dark", GlassParams>;
    /** Maximum displacement, in px, on each axis. */
    dx: number;
    dy: number;
    chroma: number;
    specular: number;
    /** Opaque background of the copy: what sits behind the content. */
    background: string;
    /** Size of the container being copied. */
    width: number;
    height: number;
    children: Snippet;
};
declare const Lens: import("svelte").Component<Props, {}, "">;
type Lens = ReturnType<typeof Lens>;
export default Lens;

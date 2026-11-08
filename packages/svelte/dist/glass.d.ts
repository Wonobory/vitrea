/**
 * The displacement map for the glass lens of `BidBar`, ported from Aave
 * (aave.com/design/building-glass-for-the-web; read from their code, which
 * the article doesn't publish).
 *
 * Red = x displacement, green = y, 128 = none. Blue = specular highlight
 * (128 = none), which the filter lightens or darkens.
 *
 * What makes it look like glass isn't magnifying the whole lens: the inside
 * is flat (no displacement) and everything happens in a bevel `depth` px wide
 * along the edge, where the slope of a spherical dome bends what's beneath.
 */
export type GlassParams = {
    /** Bevel width, in lens px. */
    depth: number;
    /** Dome height: how much the displacement curves towards the edge. */
    dome: number;
    /** <1 opens the displacement outwards near the edge. */
    aperture: number;
    /** The highlight: a rotated glow and a rim on the edge. */
    angle: number;
    glow: number;
    spread: number;
    exponent: number;
    rim: number;
    rimWidth: number;
    rimExponent: number;
};
/** Aave's slider values for each theme. */
export declare const GLASS: Record<"light" | "dark", GlassParams>;
/**
 * Aave's option selector ("Glass Toggle Group"): flat bevel (no dome), no
 * aperture, and the highlight almost only on the rim.
 */
export declare const GLASS_SELECTOR: Record<"light" | "dark", GlassParams>;
/** `glassMap`, once per shape and parameters: the lens mounts and unmounts often. */
export declare function glassMapCached(width: number, height: number, radius: number, p: GlassParams): string;
/**
 * The spring that grows the lens while it moves (Aave's): it chases
 * `target(velocity)` and stops once the target is 0 and nothing moves.
 * `push()` starts it if it isn't running; `stop()` cuts it.
 */
export declare function stretchSpring(o: {
    stiffness: number;
    damping: number;
    /** What moves, in px (a point if it moves in 2D). */
    position: () => number | readonly [number, number];
    /** Where it heads for a given velocity (px/s). */
    target: (vel: number) => number;
    paint: (v: number) => void;
}): {
    push(): void;
    stop(): void;
};
/**
 * Paints the map of a `width` × `height` px lens (radius `radius`) on a
 * `side` × `side` canvas and returns it as a data URL. `feImage` stretches
 * it to the lens.
 */
export declare function glassMap(width: number, height: number, radius: number, p: GlassParams, side?: number): string;

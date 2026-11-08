type $$ComponentProps = {
    title: string;
    /** Inside a section ("More ranges"): second-level title. */
    sub?: boolean;
    values: number[];
    /** The bounds set ("" = no bound). */
    min: string;
    max: string;
    /** On release, and only if something changed. */
    onChange: (min: string, max: string) => void;
    /** The axis domain; anything outside falls in the first or last bar. */
    lo: number;
    hi: number;
    /**
     * Logarithmic for things that go from a garage to a warehouse (three
     * orders of magnitude: linear piled everything into the first bar);
     * linear for the year.
     */
    log?: boolean;
    /** What gets stored when dragging: €83,172 dragged stays at €83,000. */
    round: (v: number) => number;
    /** The value without unit, short: "30k", "1,200", "1975". */
    short: (v: number) => string;
    unit?: string;
    ticks: [number, string][];
};
declare const RangeHistogram: import("svelte").Component<$$ComponentProps, {}, "">;
type RangeHistogram = ReturnType<typeof RangeHistogram>;
export default RangeHistogram;

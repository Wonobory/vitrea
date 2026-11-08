/**
 * Where winning bids land, in % of the appraised value: one bar per 5 %,
 * coloured by the legal band it falls in (as in the range lens), with the
 * thresholds, the median, and a glass readout on hover.
 *
 * Hand-made SVG, like Pujarr's own charts: few elements, every one placed.
 * Bars are full-height rects scaled from the baseline with CSS, so they grow
 * with the spring curve and a small stagger, and morph when the data changes.
 */
type Zone = readonly [from: number, color: string];
type $$ComponentProps = {
    /** Share of auctions (any unit) in each bin, from 0 %. */
    bins: number[];
    /** Bin width, in % of value. */
    step?: number;
    zones?: readonly Zone[];
    thresholds?: number[];
    label: string;
};
declare const Histogram: import("svelte").Component<$$ComponentProps, {}, "">;
type Histogram = ReturnType<typeof Histogram>;
export default Histogram;

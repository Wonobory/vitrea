/**
 * Fused selection: consecutive items that are "on" share one piece of glass
 * behind them (toggle group in multiple mode, a calendar range). Each run
 * keeps its piece while it grows or shrinks (matched by overlap), so pieces
 * stretch, merge and split on `--spring-small` instead of popping; new pieces
 * scale in, old ones fade out.
 *
 * `use:fuse={{ items, on, className }}` on the container. Pieces are
 * absolutely positioned spans prepended to it; items must paint above them
 * (`relative z-10`, or simply come later in the DOM). Runs break where `row`
 * changes (calendar weeks).
 */
export type FuseOptions = {
    /** Selector of the items, relative to the container. */
    items: string;
    /** Whether an item is part of the selection. */
    on: (el: HTMLElement) => boolean;
    /** Classes for each piece. */
    className: string;
    /** Runs never cross a change of row (e.g. `el => el.closest("tr")`). */
    row?: (el: HTMLElement) => unknown;
    /** Attributes whose change means the selection changed. */
    watch?: string[];
};
export declare function fuse(node: HTMLElement, options: FuseOptions): {
    update(next: FuseOptions): void;
    destroy(): void;
};

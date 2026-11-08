type $$ComponentProps = {
    /** Total number of pages. */
    pages: number;
    /** Current page, from 1. */
    page?: number;
    /** Slots shown in the strip (odd keeps the lens centred on a number). */
    visible?: number;
    label?: string;
    onchange?: (page: number) => void;
};
declare const PageLens: import("svelte").Component<$$ComponentProps, {}, "page">;
type PageLens = ReturnType<typeof PageLens>;
export default PageLens;

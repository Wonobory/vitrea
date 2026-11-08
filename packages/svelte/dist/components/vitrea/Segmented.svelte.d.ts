/**
   * Single-choice segmented control with a sliding indicator: the active
   * background is one rectangle that moves, not each button's own.
   *
   * Options sit in equal columns, so the indicator is `1/n` wide and moves
   * `i × 100 %` of itself: nothing to measure in the DOM. The version that
   * measured `offsetLeft` drifted out of place when the width changed (a panel
   * opening, a font loading) without the selection changing.
   *
   * With `glass`, the indicator is a glass lens like Aave's selector (see
   * `Lens`): it bends a copy of the options with the chosen one in the
   * action colour, travels with `springSmall` and grows a little as it moves.
   * There the width is measured, because the filter works in px.
   *
   * `onSelect` rather than `bind:`: the Map/List switch navigates, and the
   * indicator mustn't move until `value` really changes.
   */
import { type Snippet } from "svelte";
declare function $$render<T extends string>(): {
    props: {
        /** Value, text and, if the text isn't enough for a screen reader, its `aria-label`. */
        options: readonly (readonly [T, string, string?])[];
        value: T;
        onSelect: (v: T) => void;
        /** The group's `aria-label`. */
        label: string;
        /** `id` of the panel it controls, if any (tabs pattern). */
        controls?: string;
        /** Less padding and smaller type: for four options in a narrow column. */
        compact?: boolean;
        /** Neutral indicator instead of the action colour: for secondary controls. */
        subtle?: boolean;
        /** Glass indicator. */
        glass?: boolean;
        /** No border of its own: floating over a map that already has one, it would be a card inside a card. */
        borderless?: boolean;
        /** Tabs (with `controls`) or radio: a filter doesn't switch panels. */
        role?: "tab" | "radio";
        /** As a grid, how many per row (otherwise all in one). The indicator moves in both directions. */
        columns?: number;
        /**
         * What goes inside each option, if it's more than the text (e.g. with a
         * count). Inherits the colour. Receives whether it's selected and whether
         * it's painted inside the glass (the copy the lens bends) or beneath.
         */
        content?: Snippet<[T, string, boolean, boolean]>;
        /** What's behind the control: the background of the copy the glass bends. */
        background?: string;
        class?: string;
    };
    exports: {};
    bindings: "";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T extends string> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T extends string>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T extends string>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const Segmented: $$IsomorphicComponent;
type Segmented<T extends string> = InstanceType<typeof Segmented<T>>;
export default Segmented;

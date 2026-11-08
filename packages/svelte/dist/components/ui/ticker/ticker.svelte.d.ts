type Props = {
    value: number;
    /** How the number is written (currency, %, units…). Defaults to grouped digits. */
    format?: (n: number) => string;
    class?: string;
};
declare const Ticker: import("svelte").Component<Props, {}, "">;
type Ticker = ReturnType<typeof Ticker>;
export default Ticker;

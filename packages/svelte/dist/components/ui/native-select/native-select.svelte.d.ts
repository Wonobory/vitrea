import { type WithElementRef } from "../../../utils.js";
import type { HTMLSelectAttributes } from "svelte/elements";
type NativeSelectProps = Omit<WithElementRef<HTMLSelectAttributes>, "size"> & {
    size?: "sm" | "default";
};
declare const NativeSelect: import("svelte").Component<NativeSelectProps, {}, "ref" | "value">;
type NativeSelect = ReturnType<typeof NativeSelect>;
export default NativeSelect;

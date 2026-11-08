/**
     * The icon of a toggle, filled while on. Turning it on (not off: that just
     * empties) it beats from 0.6 to 1.3 and settles while a ring opens and six
     * sparks fly out, in the brand accent. From Pujarr's follow button.
     */
import type { Component } from "svelte";
type $$ComponentProps = {
    pressed: boolean;
    icon: Component<{
        class?: string;
    }>;
};
declare const ToggleIcon: Component<$$ComponentProps, {}, "">;
type ToggleIcon = ReturnType<typeof ToggleIcon>;
export default ToggleIcon;

import { Menubar as MenubarPrimitive } from "bits-ui";
import { type WithoutChildrenOrChild } from "../../../utils.js";
import MenubarPortal from "./menubar-portal.svelte";
import type { ComponentProps } from "svelte";
type $$ComponentProps = MenubarPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof MenubarPortal>>;
};
declare const MenubarContent: import("svelte").Component<$$ComponentProps, {}, "ref">;
type MenubarContent = ReturnType<typeof MenubarContent>;
export default MenubarContent;

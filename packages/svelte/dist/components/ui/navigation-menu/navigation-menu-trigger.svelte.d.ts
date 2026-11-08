export declare const navigationMenuTriggerStyle: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "relative z-10 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center outline-none disabled:pointer-events-none", {} | {}, undefined, import("tailwind-variants").TVReturnTypeLike<unknown, undefined>>;
import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
declare const NavigationMenuTrigger: import("svelte").Component<NavigationMenuPrimitive.TriggerProps, {}, "ref">;
type NavigationMenuTrigger = ReturnType<typeof NavigationMenuTrigger>;
export default NavigationMenuTrigger;

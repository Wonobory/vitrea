/**
 * The recessed field shared by input, textarea, select and native select:
 * sunk a little into the page (inner shadow, muted fill) at rest, lifted to
 * the card surface with a soft ring of the action colour when focused. The
 * ring arrives as a halo that opens wide and settles on the spring, once
 * (`animate-field-halo`, app.css). One focus indicator only (the global
 * outline is off here). Caret and selection take the accent colour.
 *
 * Written out twice, not composed: Tailwind only sees literal class names.
 */
export declare const fieldClass = "rounded-md border border-foreground/15 dark:border-input bg-[color-mix(in_oklch,var(--muted)_70%,var(--card))] shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] dark:bg-[color-mix(in_oklch,var(--background)_35%,var(--card))] dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)] transition-[color,background-color,border-color,box-shadow] duration-200 outline-none caret-primary selection:bg-primary/25 placeholder:text-muted-foreground hover:border-foreground/30 dark:hover:border-foreground/20 focus-visible:border-ring focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:shadow-none focus-visible:animate-field-halo aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/15 disabled:cursor-not-allowed disabled:opacity-50";
/** The same, for a wrapper whose control is inside (input group, OTP). */
export declare const fieldGroupClass = "rounded-md border border-foreground/15 dark:border-input bg-[color-mix(in_oklch,var(--muted)_70%,var(--card))] shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] dark:bg-[color-mix(in_oklch,var(--background)_35%,var(--card))] dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)] transition-[color,background-color,border-color,box-shadow] duration-200 caret-primary selection:bg-primary/25 hover:border-foreground/30 dark:hover:border-foreground/20 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:bg-card has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/20 has-[[data-slot=input-group-control]:focus-visible]:shadow-none has-[[data-slot=input-group-control]:focus-visible]:animate-field-halo has-[[data-slot][aria-invalid=true]]:border-danger has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-danger/15";

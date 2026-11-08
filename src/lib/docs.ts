/** The catalogue. Each entry has an example at `src/lib/examples/<slug>.svelte`. */
export type Doc = { slug: string; name: string; description: string };
export type Group = { name: string; docs: Doc[] };

export const NAME = "Vitrea";

export const GROUPS: Group[] = [
  {
    name: "Forms",
    docs: [
      { slug: "input", name: "Input", description: "Text input." },
      { slug: "input-group", name: "Input group", description: "Input with leading and trailing addons." },
      { slug: "input-otp", name: "Input OTP", description: "One-time code input with separate slots." },
      { slug: "textarea", name: "Textarea", description: "Multi-line text input." },
      { slug: "field", name: "Field", description: "Label, control, description and error laid out together." },
      { slug: "label", name: "Label", description: "Accessible label for a control." },
      { slug: "checkbox", name: "Checkbox", description: "Binary choice." },
      { slug: "radio-group", name: "Radio group", description: "One choice out of a set." },
      { slug: "switch", name: "Switch", description: "On/off toggle." },
      { slug: "slider", name: "Slider", description: "Pick a value or a range. The knob turns into a glass lens that bends the track while you drag it." },
      { slug: "range-histogram", name: "Range histogram", description: "The map's price filter: drag across the bars to pick a range, or drag an edge to move it. The count updates as you drag." },
      { slug: "select", name: "Select", description: "Pick from a list in a popover." },
      { slug: "native-select", name: "Native select", description: "The platform select, styled." },
      { slug: "toggle", name: "Toggle", description: "Two-state button." },
      { slug: "toggle-group", name: "Toggle group", description: "A set of toggles, single or multiple." },
      { slug: "segmented", name: "Segmented control", description: "Single-choice selector whose indicator is a real refracting lens that slides between options." },
      { slug: "pill", name: "Pill", description: "Dense multi-select pill with a live count of what each option would return." },
      { slug: "button", name: "Button", description: "Filled, neutral and ghost glass buttons with a specular rim and spring press." },
      { slug: "button-group", name: "Button group", description: "Buttons joined into one control." },
      { slug: "calendar", name: "Calendar", description: "Date picker grid." },
      { slug: "range-calendar", name: "Range calendar", description: "Pick a start and end date." },
    ],
  },
  {
    name: "Overlays",
    docs: [
      { slug: "dialog", name: "Dialog", description: "Modal window over a blurred backdrop." },
      { slug: "alert-dialog", name: "Alert dialog", description: "Modal that asks for confirmation." },
      { slug: "sheet", name: "Sheet", description: "Panel that slides in from an edge." },
      { slug: "drawer", name: "Drawer", description: "Bottom sheet you can drag to dismiss." },
      { slug: "popover", name: "Popover", description: "Floating content anchored to a trigger." },
      { slug: "hover-card", name: "Hover card", description: "Preview content on hover." },
      { slug: "tooltip", name: "Tooltip", description: "Short hint on hover or focus." },
      { slug: "dropdown-menu", name: "Dropdown menu", description: "Menu of actions from a button." },
      { slug: "context-menu", name: "Context menu", description: "Menu on right click." },
      { slug: "menubar", name: "Menubar", description: "Desktop-style menu bar." },
      { slug: "command", name: "Command", description: "Searchable command palette." },
      { slug: "sonner", name: "Toast", description: "Stacked, swipeable notifications." },
    ],
  },
  {
    name: "Navigation",
    docs: [
      { slug: "tabs", name: "Tabs", description: "Switch between panels." },
      { slug: "breadcrumb", name: "Breadcrumb", description: "Where you are in a hierarchy." },
      { slug: "pagination", name: "Pagination", description: "Page numbers slide under a fixed glass lens, like a picker. The width never changes, so nothing jumps." },
      { slug: "navigation-menu", name: "Navigation menu", description: "Site navigation with rich submenus." },
    ],
  },
  {
    name: "Layout",
    docs: [
      { slug: "card", name: "Card", description: "Grouped content with header and footer." },
      { slug: "item", name: "Item", description: "A row with media, content and actions." },
      { slug: "accordion", name: "Accordion", description: "Stacked sections that expand one at a time." },
      { slug: "collapsible", name: "Collapsible", description: "Show and hide a block." },
      { slug: "table", name: "Table", description: "Sortable rows that glide into place, with a sliding glass highlight and selection." },
      { slug: "carousel", name: "Carousel", description: "Swipeable slides." },
      { slug: "resizable", name: "Resizable", description: "Panels split by a draggable handle." },
      { slug: "scroll-area", name: "Scroll area", description: "Scroll container with themed scrollbars." },
      { slug: "aspect-ratio", name: "Aspect ratio", description: "Keep content at a fixed ratio." },
      { slug: "separator", name: "Separator", description: "Visual divider." },
      { slug: "empty", name: "Empty", description: "Empty state with icon, text and action." },
    ],
  },
  {
    name: "Feedback",
    docs: [
      { slug: "alert", name: "Alert", description: "Callout for important information." },
      { slug: "badge", name: "Badge", description: "Small status label." },
      { slug: "ticker", name: "Ticker", description: "A number that rolls when it changes: only the digits that change move, up or down. For counts, prices and percentages." },
      { slug: "progress", name: "Progress", description: "Completion bar." },
      { slug: "spinner", name: "Spinner", description: "Indeterminate loading indicator." },
      { slug: "skeleton", name: "Skeleton", description: "Placeholder while content loads." },
      { slug: "avatar", name: "Avatar", description: "User image with fallback." },
      { slug: "kbd", name: "Kbd", description: "Keyboard key." },
      { slug: "chart", name: "Chart", description: "A hand-made histogram that grows and morphs on a spring, plus themed LayerChart charts." },
    ],
  },
];

export const DOCS: Doc[] = GROUPS.flatMap((g) => g.docs);

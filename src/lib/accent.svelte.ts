/**
 * The site's accent: a hue and a chroma factor (`--accent-h`, `--accent-c` in
 * app.css), remembered per browser. `app.html` applies the saved one before
 * the first paint, so the page never flashes indigo first.
 */
export const KEY = "vitrea:accent";

export type Accent = { name: string; h: number; c: number };

/** Hues that hold up at the accent's lightness (L 0.57 / 0.74); the chroma factor tames the ones that would leave the gamut. */
export const ACCENTS: Accent[] = [
  { name: "Indigo", h: 273, c: 1 },
  { name: "Blue", h: 250, c: 0.9 },
  { name: "Violet", h: 300, c: 1 },
  { name: "Pink", h: 350, c: 0.95 },
  { name: "Red", h: 25, c: 0.95 },
  { name: "Orange", h: 50, c: 0.85 },
  { name: "Green", h: 150, c: 0.7 },
  { name: "Teal", h: 190, c: 0.6 },
  { name: "Graphite", h: 273, c: 0 },
];

function load(): Accent {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (saved && typeof saved.h === "number" && typeof saved.c === "number") return saved;
  } catch {}
  return ACCENTS[0]!;
}

export const accent = $state<{ current: Accent }>({ current: ACCENTS[0]! });

/** Call once on the client: picks up what `app.html` already applied. */
export function initAccent() {
  accent.current = load();
}

export function setAccent(a: Accent) {
  accent.current = a;
  const root = document.documentElement.style;
  root.setProperty("--accent-h", String(a.h));
  root.setProperty("--accent-c", String(a.c));
  try {
    localStorage.setItem(KEY, JSON.stringify(a));
  } catch {}
}

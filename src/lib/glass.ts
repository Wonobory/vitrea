/**
 * The displacement map for the glass lens of `BidBar`, ported from Aave
 * (aave.com/design/building-glass-for-the-web; read from their code, which
 * the article doesn't publish).
 *
 * Red = x displacement, green = y, 128 = none. Blue = specular highlight
 * (128 = none), which the filter lightens or darkens.
 *
 * What makes it look like glass isn't magnifying the whole lens: the inside
 * is flat (no displacement) and everything happens in a bevel `depth` px wide
 * along the edge, where the slope of a spherical dome bends what's beneath.
 */

export type GlassParams = {
  /** Bevel width, in lens px. */
  depth: number;
  /** Dome height: how much the displacement curves towards the edge. */
  dome: number;
  /** <1 opens the displacement outwards near the edge. */
  aperture: number;
  /** The highlight: a rotated glow and a rim on the edge. */
  angle: number;
  glow: number;
  spread: number;
  exponent: number;
  rim: number;
  rimWidth: number;
  rimExponent: number;
};

/** Aave's slider values for each theme. */
export const GLASS: Record<"light" | "dark", GlassParams> = {
  light: {
    depth: 2,
    dome: 5,
    aperture: 0.5,
    angle: 30,
    glow: 0.4,
    spread: 0.5,
    exponent: 2,
    rim: 0.5,
    rimWidth: 1,
    rimExponent: 1,
  },
  dark: {
    depth: 2,
    dome: 5,
    aperture: 0.5,
    angle: 45,
    glow: 0.4,
    spread: 0.5,
    exponent: 1.5,
    rim: 0.5,
    rimWidth: 1,
    rimExponent: 1.5,
  },
};

/**
 * Aave's option selector ("Glass Toggle Group"): flat bevel (no dome), no
 * aperture, and the highlight almost only on the rim.
 */
export const GLASS_SELECTOR: Record<"light" | "dark", GlassParams> = {
  light: {
    depth: 2.5,
    dome: 0,
    aperture: 1,
    angle: 28,
    glow: 0,
    spread: 0.5,
    exponent: 3,
    rim: 0.15,
    rimWidth: 1.5,
    rimExponent: 1,
  },
  dark: {
    depth: 2.5,
    dome: 0,
    aperture: 1,
    angle: 45,
    glow: 0.5,
    spread: 0.3,
    exponent: 1.5,
    rim: 0.6,
    rimWidth: 1,
    rimExponent: 1.5,
  },
};

/** Approximation of the error function. */
const erf = (x: number) => Math.tanh(1.7724538509 * x);

/** Mean slope of the sphere of radius `R` between 0 and `a` (trapezoids). */
function meanSlope(R: number, a: number) {
  let s = 0;
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * a;
    const v = x / Math.sqrt(R * R - x * x);
    s += i === 0 || i === 200 ? 0.5 * v : v;
  }
  return s / 200;
}

/** The sphere whose dome rises `height` over a half-width `a`, normalised to a mean slope of ½. */
function domeOf(height: number, ax: number, ay: number) {
  const h = Math.max(0.01, Math.min(height, Math.min(ax, ay) - 1));
  const Rx = (ax * ax + h * h) / (2 * h);
  const Ry = (ay * ay + h * h) / (2 * h);
  const mx = meanSlope(Rx, ax);
  const my = meanSlope(Ry, ay);
  return { Rx, Ry, kx: mx > 0 ? 0.5 / mx : 1, ky: my > 0 ? 0.5 / my : 1 };
}

const slope = (x: number, R: number, k: number) => {
  const c = Math.min(x, 0.999 * R);
  return (c / Math.sqrt(R * R - c * c)) * k;
};

/** Signed distance to a centred rounded rectangle (half-sides `w`, `h`, radius `r`). */
function sdf(x: number, y: number, w: number, h: number, r: number) {
  const qx = x - w + r;
  const qy = y - h + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

const cache = new Map<string, string>();

/** `glassMap`, once per shape and parameters: the lens mounts and unmounts often. */
export function glassMapCached(width: number, height: number, radius: number, p: GlassParams) {
  const k = `${Math.round(width)}|${Math.round(height)}|${Math.round(radius)}|${JSON.stringify(p)}`;
  let url = cache.get(k);
  if (!url) cache.set(k, (url = glassMap(Math.round(width), Math.round(height), Math.round(radius), p)));
  return url;
}

/**
 * The spring that grows the lens while it moves (Aave's): it chases
 * `target(velocity)` and stops once the target is 0 and nothing moves.
 * `push()` starts it if it isn't running; `stop()` cuts it.
 */
export function stretchSpring(o: {
  stiffness: number;
  damping: number;
  /** What moves, in px (a point if it moves in 2D). */
  position: () => number | readonly [number, number];
  /** Where it heads for a given velocity (px/s). */
  target: (vel: number) => number;
  paint: (v: number) => void;
}) {
  let frame = 0;
  let t = 0;
  let v = 0;
  return {
    push() {
      if (frame) return;
      let before = performance.now();
      const point = () => {
        const p = o.position();
        return typeof p === "number" ? ([p, 0] as const) : p;
      };
      let prev = point();
      const step = (now: number) => {
        const dt = (now - before) / 1000;
        before = now;
        const h = Math.min(dt, 0.033);
        const x = point();
        const vel = Math.hypot(x[0] - prev[0], x[1] - prev[1]) / Math.min(Math.max(dt, 0.008), 0.03);
        prev = x;
        const goal = o.target(vel);
        v += (-o.stiffness * (t - goal) - o.damping * v) * h;
        t += v * h;
        if (goal === 0 && Math.abs(t) < 5e-4 && Math.abs(v) < 0.005 && vel < 0.005) {
          t = v = 0;
          o.paint(0);
          frame = 0;
          return;
        }
        o.paint(t);
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

/**
 * Paints the map of a `width` × `height` px lens (radius `radius`) on a
 * `side` × `side` canvas and returns it as a data URL. `feImage` stretches
 * it to the lens.
 */
export function glassMap(width: number, height: number, radius: number, p: GlassParams, side = 128) {
  const n = width / 2;
  const l = height / 2;
  const c = document.createElement("canvas");
  c.width = c.height = side;
  const g = c.getContext("2d")!;
  const img = g.createImageData(side, side);

  const S = Math.min(radius, n, l);
  const wi = Math.max(0, n - p.depth);
  const hi = Math.max(0, l - p.depth);
  const ri = Math.max(0, Math.min(radius, wi, hi));
  const invSigma = p.depth > 0 ? 1 / (p.depth * Math.SQRT2) : 1e6;
  const highlight = p.glow > 0 || p.rim > 0;
  const cos = Math.cos((p.angle * Math.PI) / 180);
  const sin = Math.sin((p.angle * Math.PI) / 180);
  const from = (1 - p.spread) * Math.SQRT2;
  const span = p.spread * Math.SQRT2;
  const dome = p.dome > 0 ? domeOf(p.dome, n, l) : null;
  const inv = 1 / (0.5 * Math.min(n, l));
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));

  for (let j = 0; j < side; j++)
    for (let i = 0; i < side; i++) {
      const k = (j * side + i) * 4;
      const x = ((i + 0.5) / side) * 2 * n - n;
      const y = ((j + 0.5) / side) * 2 * l - l;
      const ax = Math.abs(x);
      const ay = Math.abs(y);
      const outside = sdf(ax, ay, n, l, S);
      img.data[k + 3] = 255;
      if (outside >= 0) {
        img.data[k] = img.data[k + 1] = img.data[k + 2] = 128;
        continue;
      }
      let u = dome ? Math.sign(x) * slope(ax, dome.Rx, dome.kx) : clamp(x / n);
      let v = dome ? Math.sign(y) * slope(ay, dome.Ry, dome.ky) : clamp(y / l);

      // Aperture: near an edge, drop the component running along it and keep
      // the magnitude, so the displacement opens up.
      if (p.aperture < 1) {
        const ey = Math.max(0, 1 - (l - ay) * inv) * (1 - p.aperture);
        const ex = Math.max(0, 1 - (n - ax) * inv) * (1 - p.aperture);
        if (ey > 0.001 || ex > 0.001) {
          const m0 = Math.hypot(u, v);
          u *= 1 - ey;
          v *= 1 - ex;
          const m1 = Math.hypot(u, v);
          if (m1 > 0.001) {
            u *= m0 / m1;
            v *= m0 / m1;
          }
        }
      }

      // Only the bevel displaces: 0 inside, ~1 at the edge, with a smooth step.
      const bevel = 0.5 * (1 + erf(sdf(ax, ay, wi, hi, ri) * invSigma));
      img.data[k] = Math.round((0.5 - 0.5 * u * bevel) * 255);
      img.data[k + 1] = Math.round((0.5 - 0.5 * v * bevel) * 255);

      if (highlight) {
        const e = Math.abs(clamp(x / n) * cos + clamp(y / l) * sin);
        let s = 0;
        if (p.glow > 0) s += p.glow * (span > 0.001 ? Math.min(1, Math.max(0, e - from) / span) : 0) ** p.exponent * bevel;
        if (p.rim > 0) s += p.rim * Math.max(0, 1 + outside / p.rimWidth) * e ** p.rimExponent;
        img.data[k + 2] = Math.round(127 * Math.min(1, s) + 128);
      } else img.data[k + 2] = 128;
    }
  g.putImageData(img, 0, 0);
  return c.toDataURL();
}

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

const LIGHT: GlassParams = {
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
};

/** Default lens parameters per theme. */
export const GLASS: Record<"light" | "dark", GlassParams> = {
	light: LIGHT,
	dark: { ...LIGHT, angle: 45, exponent: 1.5, rimExponent: 1.5 },
};

/** Lens parameters for option selectors: flat bevel, highlight on the rim. */
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

/** Round lens over a surface (slider thumb, cursor lens). */
export const LENS_ROUND = { glass: GLASS, chroma: 0.65, specular: 1.5 };

/** Lens of an option selector (segmented control, page strip). */
export const LENS_SELECTOR = { glass: GLASS_SELECTOR, chroma: 0.1, specular: 1 };
export const selectorShift = (w: number, h: number) => ({
	dx: Math.min(0.13 * w, 6),
	dy: 0.06 * h,
});

const alpha = (c: string) => {
	const m = c.match(/\/\s*([\d.]+)(%?)\s*\)$/) ?? c.match(/^rgba\(.*,\s*([\d.]+)\)$/);
	if (!m) return c === "transparent" ? 0 : 1;
	return Number(m[1]) / (m[2] ? 100 : 1);
};

/** The first fully opaque background behind `el`. */
export const backdropOf = (el: Element | null) => {
	for (let n = el; n; n = n.parentElement) {
		const c = getComputedStyle(n).backgroundColor;
		if (alpha(c) >= 1) return c;
	}
	return "var(--background)";
};

const erf = (x: number) => Math.tanh(1.7724538509 * x);

const meanSlope = (R: number, a: number) => {
	let s = 0;
	for (let i = 0; i <= 200; i++) {
		const x = (i / 200) * a;
		const v = x / Math.sqrt(R * R - x * x);
		s += i === 0 || i === 200 ? 0.5 * v : v;
	}
	return s / 200;
};

const domeOf = (height: number, ax: number, ay: number) => {
	const h = Math.max(0.01, Math.min(height, Math.min(ax, ay) - 1));
	const Rx = (ax * ax + h * h) / (2 * h);
	const Ry = (ay * ay + h * h) / (2 * h);
	const mx = meanSlope(Rx, ax);
	const my = meanSlope(Ry, ay);
	return { Rx, Ry, kx: mx > 0 ? 0.5 / mx : 1, ky: my > 0 ? 0.5 / my : 1 };
};

const slope = (x: number, R: number, k: number) => {
	const c = Math.min(x, 0.999 * R);
	return (c / Math.sqrt(R * R - c * c)) * k;
};

const sdf = (x: number, y: number, w: number, h: number, r: number) => {
	const qx = x - w + r;
	const qy = y - h + r;
	return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
};

const cache = new Map<string, string>();

/** Memoised `glassMap`. */
export const glassMapCached = (width: number, height: number, radius: number, p: GlassParams) => {
	const [w, h, r] = [width, height, radius].map(Math.round) as [number, number, number];
	const k = `${w}|${h}|${r}|${JSON.stringify(p)}`;
	let url = cache.get(k);
	if (!url) {
		if (cache.size >= 32) cache.delete(cache.keys().next().value!);
		cache.set(k, (url = glassMap(w, h, r, p)));
	}
	return url;
};

/** Spring that chases `target(velocity)`. `push()` starts it, `stop()` cuts it. */
export const stretchSpring = (o: {
	stiffness: number;
	damping: number;
	/** What moves, in px (a point if it moves in 2D). */
	position: () => number | readonly [number, number];
	/** Where it heads for a given velocity (px/s). */
	target: (vel: number) => number;
	paint: (v: number) => void;
}) => {
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
				const vel =
					Math.hypot(x[0] - prev[0], x[1] - prev[1]) / Math.min(Math.max(dt, 0.008), 0.03);
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
};

/** Displacement map of a `width` × `height` lens with corner `radius`, as a data URL for `feImage`. */
export const glassMap = (width: number, height: number, radius: number, p: GlassParams) => {
	const side = 128;
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

			const bevel = 0.5 * (1 + erf(sdf(ax, ay, wi, hi, ri) * invSigma));
			img.data[k] = Math.round((0.5 - 0.5 * u * bevel) * 255);
			img.data[k + 1] = Math.round((0.5 - 0.5 * v * bevel) * 255);

			const e = Math.abs(clamp(x / n) * cos + clamp(y / l) * sin);
			const glow = (span > 0.001 ? Math.min(1, Math.max(0, e - from) / span) : 0) ** p.exponent;
			const s =
				p.glow * glow * bevel + p.rim * Math.max(0, 1 + outside / p.rimWidth) * e ** p.rimExponent;
			img.data[k + 2] = Math.round(127 * Math.min(1, s) + 128);
		}
	g.putImageData(img, 0, 0);
	return c.toDataURL();
};

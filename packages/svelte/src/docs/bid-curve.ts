export const below = (quantiles: readonly (readonly [number, number])[], x: number): number => {
	const [t0, v0] = quantiles[0]!,
		[tn, vn] = quantiles.at(-1)!;
	if (x <= v0) return t0 * Math.max(0, x / v0);
	if (x >= vn) return tn;
	const i = quantiles.findIndex(([, v]) => v >= x);
	const [ta, va] = quantiles[i - 1]!,
		[tb, vb] = quantiles[i]!;
	return vb > va ? ta + ((tb - ta) * (x - va)) / (vb - va) : tb;
};

export interface BidCurve {
	heights: number[];
	peaks: { at: number; height: number }[];
}

export const bidCurve = (
	quantiles: readonly (readonly [number, number])[],
	to: number,
	peaks: readonly (readonly [number, number])[] = [],
	n = 160
): BidCurve => {
	const step = to / (n - 1);
	const [, v0] = quantiles[0]!,
		[, v1] = quantiles[1]!;
	const [, vn] = quantiles.at(-1)!,
		[, vm] = quantiles.at(-2)!;
	const knots: [number, number][] = [
		[0, Math.max(0, v0 - (v1 - v0))],
		...quantiles.map(([t, v]) => [t, v] as [number, number]),
		[1, vn + (vn - vm)],
	];
	const raw = Array.from({ length: n }, (_, i) => {
		const x = i * step;
		for (let k = 1; k < knots.length; k++) {
			const [ta, va] = knots[k - 1]!,
				[tb, vb] = knots[k]!;
			if (x >= va && x < vb) return (tb - ta) / (vb - va);
		}
		return 0;
	});
	const s = Math.max(1, n * 0.025),
		r = Math.ceil(3 * s);
	const smooth = raw.map((_, i) => {
		let a = 0,
			w = 0;
		for (let j = Math.max(0, i - r); j <= Math.min(n - 1, i + r); j++) {
			const g = Math.exp(-((j - i) ** 2) / (2 * s * s));
			a += raw[j]! * g;
			w += g;
		}
		return a / w;
	});
	const top = Math.max(...smooth) || 1;
	const heights = smooth.map((v) => (0.6 * v) / top);
	const peaksAt = peaks
		.filter(([u]) => u > 0 && u < to)
		.map(([u, rate]) => {
			const k = u / step,
				i = Math.floor(k),
				local = heights[i]! + (heights[i + 1]! - heights[i]!) * (k - i);
			return { at: u / to, height: Math.min(1, local * (rate / 0.0075)) };
		});
	return { heights, peaks: peaksAt };
};

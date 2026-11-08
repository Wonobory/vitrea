/**
 * The curve above the bid bar: where winning bids land for auctions like
 * this one, in the style of YouTube's "most replayed".
 *
 * It comes from the forecast's quantiles (2 to 98 %; measured: asking for
 * 90 % hits 93 %). Between two quantiles the density is constant (all we
 * really know) and then smoothed: with 11 points, any narrower bump would be
 * made up. Measured 10/2026: inside the band it is almost flat.
 */

/** Probability that the winning bid lands below `x` (fraction of value). */
export function below(quantiles: readonly (readonly [number, number])[], x: number): number {
  const [t0, v0] = quantiles[0]!, [tn, vn] = quantiles.at(-1)!;
  if (x <= v0) return t0 * Math.max(0, x / v0);
  if (x >= vn) return tn;
  const i = quantiles.findIndex(([, v]) => v >= x);
  const [ta, va] = quantiles[i - 1]!, [tb, vb] = quantiles[i]!;
  return vb > va ? ta + ((tb - ta) * (x - va)) / (vb - va) : tb;
}

export interface BidCurve {
  /** Heights (0–1) at evenly spaced points, left to right across the bar. */
  heights: number[];
  /** Threshold peaks: a line at `at` (fraction of the bar), `height` tall (0–1). */
  peaks: { at: number; height: number }[];
}

/**
 * The curve at `n` points from 0 to `to` (fraction of value). `peaks`:
 * [threshold, share of its system's winning bids that land exactly there].
 * Those bids sit exactly on the threshold, so they go apart, as a line in
 * their exact place, not through the smoothed curve. Measured 10/2026, inside
 * the band the half-point at a threshold holds ~8 times its neighbours (5.9 %
 * vs ~0.75 %): the peak is the curve at that point times that, capped, so
 * where hardly anyone bids it barely shows.
 */
export function bidCurve(
  quantiles: readonly (readonly [number, number])[],
  to: number,
  peaks: readonly (readonly [number, number])[] = [],
  n = 160,
): BidCurve {
  const step = to / (n - 1);
  // Density of the distribution with its tails: 2 % on each side, over a span like the next one.
  const [, v0] = quantiles[0]!, [, v1] = quantiles[1]!;
  const [, vn] = quantiles.at(-1)!, [, vm] = quantiles.at(-2)!;
  const knots: [number, number][] = [[0, Math.max(0, v0 - (v1 - v0))], ...quantiles.map(([t, v]) => [t, v] as [number, number]), [1, vn + (vn - vm)]];
  const raw = Array.from({ length: n }, (_, i) => {
    const x = i * step;
    for (let k = 1; k < knots.length; k++) {
      const [ta, va] = knots[k - 1]!, [tb, vb] = knots[k]!;
      if (x >= va && x < vb) return (tb - ta) / (vb - va);
    }
    return 0;
  });
  // Gaussian smoothing (σ = 2.5 % of the bar)
  const s = Math.max(1, n * 0.025), r = Math.ceil(3 * s);
  const smooth = raw.map((_, i) => {
    let a = 0, w = 0;
    for (let j = Math.max(0, i - r); j <= Math.min(n - 1, i + r); j++) {
      const g = Math.exp(-((j - i) ** 2) / (2 * s * s));
      a += raw[j]! * g;
      w += g;
    }
    return a / w;
  });
  const top = Math.max(...smooth) || 1;
  // The curve up to 60 % of the height: the rest leaves room for the peaks.
  const heights = smooth.map((v) => (0.6 * v) / top);
  const peaksAt = peaks
    .filter(([u]) => u > 0 && u < to)
    .map(([u, rate]) => {
      // The curve right at the threshold, times its neighbours (~0.75 % of bids per half-point in the band).
      const k = u / step, i = Math.floor(k), local = heights[i]! + (heights[i + 1]! - heights[i]!) * (k - i);
      return { at: u / to, height: Math.min(1, local * (rate / 0.0075)) };
    });
  return { heights, peaks: peaksAt };
}

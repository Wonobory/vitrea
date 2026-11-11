export type Slot = { ch: string; key: string; digit: boolean };

const decimalMark = (run: string) => {
	const seps = [...run.matchAll(/\D/g)];
	const last = seps.at(-1);
	if (!last || !/[.,]/.test(last[0])) return -1;
	const before = seps.slice(0, -1);
	if (before.some((s) => s[0] === last[0])) return -1;
	return before.length > 0 || run.length - last.index - 1 !== 3 ? last.index : -1;
};

/** Keys each character by its place in the number (integer digits from the decimal mark leftwards, decimals rightwards), so a slot keeps its key when the length changes. */
export const slotsOf = (text: string): Slot[] => {
	const chars = [...text];
	const m = /\d(?:[\d.,'’  ]*\d)?/.exec(text);
	if (!m) return chars.map((ch, i) => ({ ch, key: `s${chars.length - 1 - i}`, digit: false }));
	const start = [...text.slice(0, m.index)].length;
	const end = start + m[0].length;
	const mark = decimalMark(m[0]);
	const point = start + (mark < 0 ? m[0].length : mark);
	return chars.map((ch, i) => ({
		ch,
		digit: /\d/.test(ch),
		key:
			i < start
				? `p${start - 1 - i}`
				: i >= end
					? `s${chars.length - 1 - i}`
					: i < point
						? `i${point - 1 - i}`
						: i === point
							? "d"
							: `f${i - point - 1}`,
	}));
};

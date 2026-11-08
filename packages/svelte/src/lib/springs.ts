/** Spring easing from tension and friction, normalised to end at exactly 1. */
export const createSpringEasing = (tension: number, friction: number) => {
	const omega0 = Math.sqrt(tension);
	const zeta = friction / (2 * omega0);
	const omega1 = omega0 * Math.sqrt(1 - zeta * zeta);
	const raw = (p: number): number => {
		const t = p * 0.5;
		return (
			1 -
			Math.exp(-zeta * omega0 * t) *
				(Math.cos(omega1 * t) + ((zeta * omega0) / omega1) * Math.sin(omega1 * t))
		);
	};

	const end = raw(1);
	return (p: number): number => raw(p) / end;
};

export const springXSmall = createSpringEasing(300, 20);
export const springSmall = createSpringEasing(120, 14);

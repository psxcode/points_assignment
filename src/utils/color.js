export function rgba(r, g, b, a) {
	[r, g, b] = [r, g, b].map(checkColor);
	a = checkAlpha(a);
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function checkColor(c) {
	return typeof c === 'number' ? Math.max(0, Math.min(c, 255)) : 0;
}

export function checkAlpha(a) {
	return typeof a === 'number' ? Math.max(0, Math.min(a, 1)) : 1;
}
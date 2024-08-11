export const stringToNumber = (string) => {
	let hash = 0;

	if (string.length === 0) {
		return hash;
	}

	for (let i = 0; i < string.length; i++) {
		const char = string.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32-bit integer
	}

	return Math.abs(hash).toString().slice(0, -5);
};

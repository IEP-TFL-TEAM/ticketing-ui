export const parseFilters = (filters) =>
	Object.entries(filters)
		.reduce((acc, [key, value]) => {
			if (value != null && key !== 'page' && key !== 'perPage') {
				acc += `${key} ~ '${value}' ${key === 'title' || key === 'description' || key === 'count' ? ' || ' : ' && '}`;
			}
			return acc;
		}, '')
		.slice(0, -4);

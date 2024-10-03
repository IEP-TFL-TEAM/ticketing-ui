export const parseFilters = (filters) => {
	const conditions = Object.entries(filters).reduce((acc, [key, value]) => {
		if (value != null && key !== 'page' && key !== 'perPage') {
			if (Array.isArray(value)) {
				const arrayConditions = value.map((item) => `${key} = '${item}'`).join(' || ');
				if (arrayConditions) {
					acc += `(${arrayConditions}) && `;
				}
			} else {
				if (value) {
					acc += `${key} ~ '${value}' ${key === 'title' || key === 'description' || key === 'objective' || key === 'email' || key === 'count' || key === 'ticketNumber' || key === 'status' ? ' || ' : ' && '}`;
				}
			}
		}
		return acc;
	}, '');

	return conditions.endsWith(' || ') || conditions.endsWith(' && ')
		? conditions.slice(0, -4)
		: conditions;
};

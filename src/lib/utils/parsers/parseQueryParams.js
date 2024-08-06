export const parseQueryParams = (filters) => {
	let queryString = '';
	for (const key in filters) {
		if (filters[key]) {
			if (Array.isArray(filters[key])) {
				filters[key].forEach((value) => {
					queryString += `${key}=${encodeURIComponent(value)}&`;
				});
			} else {
				queryString += `${key}=${encodeURIComponent(filters[key])}&`;
			}
		}
	}
	queryString = queryString.replace(/&$/, '');
	return queryString;
};

export const parseLocations = (tickets) => {
	const locations = tickets?.filter((item) => {
		return item.expand.locationId;
	});

	return locations ?? [];
};

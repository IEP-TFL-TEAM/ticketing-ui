export const parseDateAndTime = (dateString) => {
	const utcDate = new Date(dateString);
	return utcDate.toLocaleString();
};

export const parseDate = (dateString) => {
	const date = new Date(dateString);

	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1;
	const day = date.getUTCDate();

	const formattedMonth = month.toString().padStart(2, '0');
	const formattedDay = day.toString().padStart(2, '0');

	return `${year}-${formattedMonth}-${formattedDay}`;
};

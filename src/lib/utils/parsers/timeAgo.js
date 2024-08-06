import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export const formatTimeAgo = (date) => {
	const now = new Date();
	const givenDate = new Date(date);
	const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;

	if (now - givenDate > twoDaysInMilliseconds) {
		// Format date as you prefer for dates older than 2 days
		return givenDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
	} else {
		// Use timeAgo for dates within the last 2 days
		return timeAgo.format(givenDate);
	}
};

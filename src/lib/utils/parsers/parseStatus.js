const statusMap = {
	CLOSED: 'badge variant-outline-success text-success-700 dark:text-success-500',
	PENDING: 'badge variant-outline-secondary text-secondary-700 dark:text-secondary-500'
};

export const parseStatus = (status) => statusMap[status];

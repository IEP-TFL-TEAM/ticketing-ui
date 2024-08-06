const statusMap = {
	OPEN: 'badge variant-filled-secondary',
	COMPLETE: 'badge variant-filled-success',
	['IN PROGRESS']: 'badge variant-filled-warning',
	CLOSED: 'badge variant-filled-error',
	PENDING: 'badge variant-filled-secondary',
	RESOLVED: 'badge variant-filled-surface'
};

export const parseStatus = (status) => statusMap[status];

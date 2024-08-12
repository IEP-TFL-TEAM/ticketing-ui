const statusMap = {
	CLOSED: 'badge variant-filled-error',
	PENDING: 'badge variant-filled-secondary',
	APPROVED: 'badge variant-filled-success'
};

export const parseStatus = (status) => statusMap[status];

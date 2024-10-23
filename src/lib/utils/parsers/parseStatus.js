const statusMap = {
	CLOSED: 'badge variant-filled-success',
	PENDING: 'badge variant-filled-secondary'
};

export const parseStatus = (status) => statusMap[status];

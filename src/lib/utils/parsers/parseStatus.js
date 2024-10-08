const statusMap = {
	CLOSED: 'badge variant-filled-error !text-white',
	PENDING: 'badge variant-filled-secondary',
	OPEN: 'badge variant-filled-success'
};

export const parseStatus = (status) => statusMap[status];

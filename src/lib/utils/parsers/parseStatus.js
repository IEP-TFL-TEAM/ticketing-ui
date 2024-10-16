const statusMap = {
	CLOSED: 'badge variant-filled-error !text-white',
	PENDING: 'badge variant-filled-secondary'
};

export const parseStatus = (status) => statusMap[status];

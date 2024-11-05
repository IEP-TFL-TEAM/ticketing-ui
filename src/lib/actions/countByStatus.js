export function countByStatus(array, status) {
	return array.filter((record) => record.status === status).length;
}

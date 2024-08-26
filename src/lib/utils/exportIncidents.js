import { xls } from './xls';
import { parseDate } from './parsers';

export const exportIncidents = (data) => {
	const rows = data.map((row) => ({
		ID: row.id,
		Title: row.title,
		Description: row.description,
		'Reported By': row.expand?.reportedBy?.firstName + ' ' + row.expand?.reportedBy?.lastName,
		Team: row.expand?.teamId?.name,
		Category: row.expand?.categoryId?.name,
		Severity: row.expand?.categoryLevelId?.name,
		'Team Equipment': row.expand?.teamEquipmentId?.name,
		Region: row.expand?.regionId?.name,
		Area: row.expand?.areaId?.name,
		Site: row.expand?.siteId?.name,
		'Fault Type': row.expand?.faultTypeId?.name,
		'Caused By': row.expand?.causedBy?.name,
		'Technician Assigned': row.expand?.technicianId?.name,
		Status: row.status,
		Solution: row.expand?.solution?.name ?? 'Not yet closed',
		'Closed by':
			row.closedBy.length > 0
				? row.expand?.closedBy?.firstName + ' ' + row.expand?.closedBy?.lastName
				: 'Not yet closed',
		'Closing remarks': row.closingRemarks ?? 'Not yet closed',
		'Ticket#': row.count,
		Created: parseDate(row.created),
		Updated: parseDate(row.updated)
	}));

	xls(rows, 'Incidents', 'Incidents.xls');
};

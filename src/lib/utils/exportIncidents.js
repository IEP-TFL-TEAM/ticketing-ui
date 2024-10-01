import { xls } from './xls';
import { parseDate } from './parsers';

export const exportIncidents = (data) => {
	const rows = data.map((row) => {
		const teamNames = row.expand?.teamIds?.map((team) => team.name) || [];
		const equipmentList = row.expand?.teamEquipmentIds?.map((eq) => eq.name) || [];

		return {
			'Ticket #': row.ticketNumber,
			Title: row.title,
			Description: row.description,
			'Reported By': row.expand?.reportedBy?.firstName + ' ' + row.expand?.reportedBy?.lastName,
			'Team(s)': teamNames.join(', '),
			Category: row.expand?.categoryId?.name,
			Severity: row.expand?.categoryLevelId?.name,
			'Team Equipment': equipmentList.join(', '),
			Region: row.expand?.regionId?.name,
			Area: row.expand?.areaId?.name,
			Site: row.expand?.siteId?.name,
			'Fault Type': row.expand?.faultTypeId?.name,
			'Caused By': row.expand?.causedBy?.name,
			'Technician Assigned': row.expand?.technicianId?.name,
			Status: row.status,
			Solution: row.expand?.solution?.name ?? '-',
			'Closed by':
				row.closedBy.length > 0
					? row.expand?.closedBy?.firstName + ' ' + row.expand?.closedBy?.lastName
					: '-',
			'Closing remarks': row.closingRemarks ?? '-',
			'Ticket#': row.count,
			Created: parseDate(row.created),
			Updated: parseDate(row.updated)
		};
	});

	xls(rows, 'Incidents', 'Incidents.xls');
};

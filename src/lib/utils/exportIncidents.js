import { xls } from './xls';
import { parseDate, parseDateAndTime } from './parsers';
import { calculateSLAStatus } from './calculateSLAStatus';

export const exportIncidents = (data) => {
	const rows = data.map((row) => {
		const teamNames = row.expand?.teamIds?.map((team) => team.name) || [];
		const departmentNames = row.expand?.departmentIds?.map((dep) => dep.name) || [];
		const equipmentList = row.expand?.teamEquipmentIds?.map((eq) => eq.name) || [];
		const listOfServices = row.expand?.servicesListIds?.map((item) => item.name) || [];

		const slaStatus = calculateSLAStatus(
			parseDateAndTime(row.incidentStart),
			parseDateAndTime(row.incidentEnd.length === 0 ? new Date() : row.incidentEnd)
		);

		return {
			'Ticket #': row.ticketNumber,
			Title: row.title,
			Description: row.description,
			'Incident Start': parseDateAndTime(row.incidentStart),
			'Incident End': row.incidentEnd.length === 0 ? '-' : parseDateAndTime(row.incidentEnd),
			'Reported By': row.expand?.reportedBy?.firstName + ' ' + row.expand?.reportedBy?.lastName,
			Category: row.expand?.categoryId?.name,
			Severity: row.expand?.categoryLevelId?.name,
			'Department(s) Concerned': departmentNames.join(', '),
			'Team(s) Involved': teamNames.join(', '),
			'Deparment Equipment(s)': equipmentList.join(', '),
			Region: row.expand?.regionId?.name,
			Area: row.expand?.areaId?.name,
			Site: row.expand?.siteId?.name,
			'Service Impact': row.serviceImpact,
			'List of Services / Circuits': listOfServices.join(', '),
			'Fault Type': row.expand?.faultTypeId?.name,
			Cause: row.expand?.cause?.name,
			'Technician Assigned': row.expand?.technicianId?.name ?? '-',
			Status: row.status,
			Solution: row.expand?.solution?.name ?? '-',
			'Closed by':
				row.closedBy.length > 0
					? row.expand?.closedBy?.firstName + ' ' + row.expand?.closedBy?.lastName
					: '-',
			'Closing remarks': row.closingRemarks ?? '-',
			'SLA Status': slaStatus.status,
			Created: parseDate(row.created),
			Updated: parseDate(row.updated)
		};
	});

	xls(rows, 'Incidents', 'Incidents.xls');
};

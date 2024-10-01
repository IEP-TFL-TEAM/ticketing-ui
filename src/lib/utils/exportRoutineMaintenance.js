import { xls } from './xls';
import { parseDateAndTime, parseDate } from './parsers';

const extractMessage = (message) => {
	return message.replace(/<[^>]+>/g, '').trim();
};

export const exportRoutineMaintenance = (data) => {
	const rows = data.map((row) => {
		const teamNames = row.expand?.teamIds?.map((team) => team.name) || [];

		return {
			'Ticket #': row.ticketNumber,
			Requesteee: row.expand?.requestee?.name,
			Date: parseDateAndTime(row.date),
			'Maintenance Title': row.title,
			'Maintenance Objective': row.objective,
			'Risk Aversion': row.riskAversion,
			'Scope of Work': extractMessage(row.scopeOfWork),
			'Task Site': row.expand?.siteId?.name,
			'Start Date & Time': parseDateAndTime(row.startDate),
			'End Date & Time': parseDateAndTime(row.endDate),
			'Service Impact': row.serviceImpact,
			'Impact Duration (minutes)': row.duration,
			'Team Conducting Maintenance': teamNames.join(', '),
			'Maintenance Team': row.expand?.maintenanceTeamId?.name,
			'List of Services / Circuits': extractMessage(row.listOfServices),
			'Awareness To Be Made': row.awarenessToBeMade,
			'Maintenance Risks': extractMessage(row.maintenanceRisks),
			'Maintenance Pre-Checklist': extractMessage(row.maintenancePreChecklist),
			'Maintenance Outcome': extractMessage(row.maintenanceOutcome),
			Created: parseDate(row.created),
			Updated: parseDate(row.updated)
		};
	});

	xls(rows, 'Routine-Maintenance', 'Routine-Maintenance.xls');
};

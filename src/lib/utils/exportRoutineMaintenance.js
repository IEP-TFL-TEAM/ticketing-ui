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
			Requesteee: row.expand?.requestee?.name ?? '-',
			'Maintenance Title': row.title,
			Objective: row.objective,
			'Scope of Work': extractMessage(row.scopeOfWork),
			'Task Site': row.expand?.siteId?.name,
			'Start Date & Time': parseDateAndTime(row.startDate),
			'End Date & Time': parseDateAndTime(row.endDate),
			'Service Impact': row.serviceImpact,
			'Impact Duration (minutes)': row.duration,
			'Team Conducting Maintenance': teamNames.join(', '),
			'Maintenance Team': row.expand?.maintenanceTeamId?.name,
			'List of Services / Circuits': extractMessage(row.listOfServices),
			Closed: row.isClosed ? 'True' : 'False',
			'Completion of Task': row?.taskCompletion.length > 0 ? row.taskCompletion : '-',
			'All related Alarms Cleared': row?.alarmsCleared.length > 0 ? row.alarmsCleared : '-',
			'Service Impact is Correct':
				row?.serviceImpactCorrect.length > 0 ? row.serviceImpactCorrect : '-',
			Created: parseDate(row.created),
			Updated: parseDate(row.updated)
		};
	});

	xls(rows, 'Routine-Maintenance', 'Routine-Maintenance.xls');
};

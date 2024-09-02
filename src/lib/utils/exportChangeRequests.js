import { xls } from './xls';
import { parseDateAndTime, parseDate } from './parsers';

const extractMessage = (message) => {
	return message.replace(/<[^>]+>/g, '').trim();
};

export const exportChangeRequests = (data) => {
	const rows = data.map((row) => {
		const teamNames = row.expand?.teamIds?.map((team) => team.name) || [];

		return {
			ID: row.id,
			Requesteee: row.expand?.requestee?.name,
			Date: parseDateAndTime(row.date),
			'Change Title': row.title,
			Objective: row.objective,
			'Start Date & Time': parseDateAndTime(row.startDate),
			'End Date & Time': parseDateAndTime(row.endDate),
			'Service Impact': row.serviceImpact,
			'Impact Duration (minutes)': row.duration,
			'Task Site': row.expand?.siteId?.name,
			'System Involved in Change': row.involvedSystem,
			'Technical Groups Involved': teamNames.join(', '),
			'Change Team': row.expand?.changeTeamId?.name,
			Summary: extractMessage(row.summary),
			'Scope of Work': extractMessage(row.scopeOfWork),
			'CR Risks & Mitigations': extractMessage(row.risksAndMitigations),
			'Roll Back Procedure': extractMessage(row.rollbackProcedures),
			'List of Services / Circuits': extractMessage(row.listOfServices),
			'Awareness To Be Made': row.awarenessToBeMade,
			Created: parseDate(row.created),
			Updated: parseDate(row.updated)
		};
	});

	xls(rows, 'Change-Requests', 'Change-Requests.xls');
};

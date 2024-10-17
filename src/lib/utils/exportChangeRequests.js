import { xls } from './xls';
import { parseDateAndTime, parseDate } from './parsers';

const extractMessage = (message) => {
	return message.replace(/<[^>]+>/g, '').trim();
};

export const exportChangeRequests = (data) => {
	const rows = data.map((row) => {
		const teamNames = row.expand?.teamIds?.map((team) => team.name) || [];

		return {
			'Ticket #': row.ticketNumber,
			Requesteee: row.expand?.requestee?.name ?? '-',
			'Change Title': row.title,
			Objective: row.objective,
			'Start Date & Time': parseDateAndTime(row.startDate),
			'End Date & Time': parseDateAndTime(row.endDate),
			'Service Impact': row.serviceImpact,
			'Task Site': row.expand?.siteId?.name,
			'System Involved in Change': row.involvedSystem,
			'Technical Groups Involved': teamNames.join(', '),
			'Change Team': row.expand?.changeTeamId?.name ?? '-',
			Summary: extractMessage(row.summary),
			'List of Services / Circuits': extractMessage(row.listOfServices),
			'Awareness To Be Made': row.awarenessToBeMade,
			Closed: row.isClosed ? 'True' : 'False',
			'CR Submission within 5 Days':
				row?.submissionWithinFiveDays.length > 0 ? row.submissionWithinFiveDays : '-',
			'Duration of the CR is adhered to':
				row?.durationAdhered.length > 0 ? row.durationAdhered : '-',
			'Service Impact is Correct':
				row?.serviceImpactCorrect.length > 0 ? row.serviceImpactCorrect : '-',
			'Correct list of Customers Submitted':
				row?.correctCustomerList.length > 0 ? row.correctCustomerList : '-',
			'Completion of Task': row?.taskCompletion.length > 0 ? row.taskCompletion : '-',
			Created: parseDate(row.created),
			Updated: parseDate(row.updated)
		};
	});

	xls(rows, 'Change-Requests', 'Change-Requests.xls');
};

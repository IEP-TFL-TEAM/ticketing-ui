import { z } from 'zod';
import { awarenessStatuses } from '$lib/utils';

const MaxAttachmentSize = 5000000; // 5MB
const AcceptedAttachmentTypes = [
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/pdf',
	'image/jpeg',
	'image/jpg',
	'image/png'
];

export const changeRequestSchema = (attachment, startDate, endDate) =>
	z
		.object({
			requestee: z.string().nullable(),

			title: z.string().min(1, {
				message: 'This field is required'
			}),

			objective: z.string().min(1, {
				message: 'This field is required'
			}),

			startDate: z.date({ message: 'Invalid date string!' }).default(startDate),

			endDate: z.date({ message: 'Invalid date string!' }).default(endDate),

			serviceImpact: z.string().refine((value) => ['Yes', 'No'].includes(value), {
				message: 'Must be of one of the types'
			}),

			siteId: z.string(),

			involvedSystem: z.string().min(1, {
				message: 'This field is required'
			}),

			teamIds: z.array(z.string()),

			changeTeamId: z.string().nullable(),

			summary: z.string().min(1, {
				message: 'This field is required'
			}),

			listOfServices: z.string().min(1, {
				message: 'This field is required'
			}),

			awarenessToBeMade: z.string().refine((value) => awarenessStatuses.includes(value), {
				message: 'Must be of one of the types'
			}),

			attachment: z
				.instanceof(File)
				.refine((file) => file.size < MaxAttachmentSize, {
					message: 'Max size is 5MB.'
				})
				.refine((file) => AcceptedAttachmentTypes.includes(file.type), {
					message: 'Only .pdf, .doc, .docx, .jpg, .png formats are supported.'
				})
				.default(attachment),

			isClosed: z.boolean({ default: false }),

			submissionWithinFiveDays: z
				.string()
				.refine((value) => ['Yes', 'No'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable(),

			durationAdhered: z
				.string()
				.refine((value) => ['Yes', 'No'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable(),

			serviceImpactCorrect: z
				.string()
				.refine((value) => ['Yes', 'No'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable(),

			correctCustomerList: z
				.string()
				.refine((value) => ['Yes', 'No'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable(),

			taskCompletion: z
				.string()
				.refine((value) => ['Yes', 'No', 'Partially Completed'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable()
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

import { z } from 'zod';

const MaxAttachmentSize = 5000000; // 5MB
const AcceptedAttachmentTypes = [
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/pdf',
	'image/jpeg',
	'image/jpg',
	'image/png'
];

export const changeRequestSchema = (attachment, date, startDate, endDate) =>
	z
		.object({
			title: z.string().min(1, {
				message: 'This field is required'
			}),

			objective: z.string().min(1, {
				message: 'This field is required'
			}),

			serviceImpact: z.string().refine((value) => ['Yes', 'No'].includes(value), {
				message: 'Must be of one of the types'
			}),

			duration: z.number().min(0),

			siteId: z.string(),

			involvedSystem: z.string().min(1, {
				message: 'This field is required'
			}),

			teamIds: z.array(z.string()),

			requestee: z.string().nullable(),

			date: z.date({ message: 'Invalid date string!' }).max(new Date()).default(date),

			startDate: z.date({ message: 'Invalid date string!' }).default(startDate),

			endDate: z.date({ message: 'Invalid date string!' }).default(endDate),

			changeTeamId: z.string().nullable(),

			summary: z
				.string()
				.min(1, {
					message: 'This field is required'
				})
				.nullable(),

			scopeOfWork: z
				.string()
				.min(1, {
					message: 'This field is required'
				})
				.nullable(),

			risksAndMitigations: z
				.string()
				.min(1, {
					message: 'This field is required'
				})
				.nullable(),

			rollbackProcedures: z
				.string()
				.min(1, {
					message: 'This field is required'
				})
				.nullable(),

			listOfServices: z
				.string()
				.min(1, {
					message: 'This field is required'
				})
				.nullable(),

			awarenessToBeMade: z
				.string()
				.refine((value) => ['No', 'Internal', 'External', 'Media'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable(),

			attachment: z
				.instanceof(File)
				.refine((file) => file.size < MaxAttachmentSize, {
					message: 'Max size is 5MB.'
				})
				.refine((file) => AcceptedAttachmentTypes.includes(file.type), {
					message: 'Only .pdf, .doc, .docx, .jpg, .png formats are supported.'
				})
				.default(attachment)
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

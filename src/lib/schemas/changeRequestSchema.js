import { z } from 'zod';

const AcceptedAttachmentTypes = [
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/pdf',
	'image/jpeg',
	'image/jpg',
	'image/png'
];

export const changeRequestSchema = () =>
	z
		.object({
			requestee: z.string(),

			date: z.date({ message: 'Invalid date string!' }).max(new Date()),

			title: z.string().min(1, {
				message: 'This field is required'
			}),

			objective: z.string().min(1, {
				message: 'This field is required'
			}),

			startDate: z.date({ message: 'Invalid date string!' }),

			endDate: z.date({ message: 'Invalid date string!' }),

			serviceImpact: z.string().refine((value) => ['Yes', 'No'].includes(value), {
				message: 'Must be of one of the types'
			}),

			duration: z.number().min(0),

			siteId: z.string(),

			involvedSystem: z.string().min(1, {
				message: 'This field is required'
			}),

			teamIds: z.array(z.string()),

			changeTeamId: z.string(),

			summary: z.string().min(1, {
				message: 'This field is required'
			}),

			scopeOfWork: z.string().min(1, {
				message: 'This field is required'
			}),

			risksAndMitigations: z.string().min(1, {
				message: 'This field is required'
			}),

			rollbackProcedures: z.string().min(1, {
				message: 'This field is required'
			}),

			listOfServices: z.string().min(1, {
				message: 'This field is required'
			}),

			awarenessToBeMade: z
				.string()
				.refine((value) => ['No', 'Internal', 'External', 'Media'].includes(value), {
					message: 'Must be of one of the types'
				}),

			attachment: z.instanceof(File).refine((file) => AcceptedAttachmentTypes.includes(file.type), {
				message: 'Only .pdf, .doc, .docx, .jpg, .png formats are supported.'
			})
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

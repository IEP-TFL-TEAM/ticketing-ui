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

export const routineMaintenanceSchema = (attachment, startDate, endDate) =>
	z
		.object({
			requestee: z.string().nullable(),

			title: z.string().min(1, {
				message: 'This field is required'
			}),

			objective: z.string().min(1, {
				message: 'This field is required'
			}),

			scopeOfWork: z.string().min(1, {
				message: 'This field is required'
			}),

			siteId: z.string(),

			startDate: z.date({ message: 'Invalid date string!' }).default(startDate),

			endDate: z.date({ message: 'Invalid date string!' }).default(endDate),

			serviceImpact: z.string().refine((value) => ['Yes', 'No'].includes(value), {
				message: 'Must be of one of the types'
			}),

			duration: z.number().min(0),

			teamIds: z.array(z.string()),

			maintenanceTeamId: z.string().nullable(),

			listOfServices: z.string().min(1, {
				message: 'This field is required'
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

			taskCompletion: z
				.string()
				.refine((value) => ['Yes', 'No', 'Partially Completed'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable(),

			alarmsCleared: z
				.string()
				.refine((value) => ['Yes', 'No', 'Alarms Outstanding'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable(),

			serviceImpactCorrect: z
				.string()
				.refine((value) => ['Yes', 'No'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable()
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

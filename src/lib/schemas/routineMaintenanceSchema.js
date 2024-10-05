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

export const routineMaintenanceSchema = () =>
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

			riskAversion: z.string().min(1, {
				message: 'This field is required'
			}),

			scopeOfWork: z.string().min(1, {
				message: 'This field is required'
			}),

			siteId: z.string(),

			startDate: z.date({ message: 'Invalid date string!' }),

			endDate: z.date({ message: 'Invalid date string!' }),

			serviceImpact: z.string().refine((value) => ['Yes', 'No'].includes(value), {
				message: 'Must be of one of the types'
			}),

			duration: z.number().min(0),

			teamIds: z.array(z.string()),

			maintenanceTeamId: z.string(),

			listOfServices: z.string().min(1, {
				message: 'This field is required'
			}),

			awarenessToBeMade: z
				.string()
				.refine((value) => ['No', 'Internal', 'External', 'Media'].includes(value), {
					message: 'Must be of one of the types'
				}),

			maintenanceRisks: z.string().min(1, {
				message: 'This field is required'
			}),

			maintenancePreChecklist: z.string().min(1, {
				message: 'This field is required'
			}),

			maintenanceOutcome: z.string().min(1, {
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
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

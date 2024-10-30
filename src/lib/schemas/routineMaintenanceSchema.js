import { z } from 'zod';

const MaxAttachmentSize = 5242880; // 5MB

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

			regionId: z.string(),

			areaId: z.string(),

			siteId: z.string(),

			startDate: z.date({ message: 'Invalid date string!' }).default(startDate),

			endDate:
				!endDate || endDate.length === 0
					? z.date({ message: 'Invalid date string!' }).nullable().optional()
					: z.date({ message: 'Invalid date string!' }).default(endDate),

			serviceImpact: z.string().refine((value) => ['Yes', 'No'].includes(value), {
				message: 'Must be of one of the types'
			}),

			duration: z.number().min(0).default(null),

			teamIds: z.array(z.string()),

			maintenanceTeamId: z.string().nullable(),

			servicesListIds: z.array(z.string()).optional().default([]),

			attachment:
				!attachment || attachment.length === 0
					? z
							.instanceof(File)
							.refine((file) => file.size <= MaxAttachmentSize, {
								message: 'Max size is 5MB.'
							})
							.nullable()
							.optional()
					: z
							.instanceof(File)
							.refine((file) => file.size <= MaxAttachmentSize, {
								message: 'Max size is 5MB.'
							})
							.default(attachment),

			status: z.string().default('PENDING'),

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
				.nullable(),

			closingRemarks: z
				.string()
				.min(1, {
					message: 'This field is required'
				})
				.nullable(),

			closingAttachment: z
				.instanceof(File)
				.refine((file) => file.size <= MaxAttachmentSize, {
					message: 'Max size is 5MB.'
				})
				.nullable()
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		})
		.refine((data) => !data.endDate || data.endDate >= data.startDate, {
			message: 'End date must be after the start date',
			path: ['endDate']
		});

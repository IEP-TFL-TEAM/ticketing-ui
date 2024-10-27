import { z } from 'zod';

const MaxAttachmentSize = 5000000; // 5MB

export const ticketSchema = (attachment, incidentStart) =>
	z
		.object({
			title: z.string().min(1, {
				message: 'This field is required'
			}),

			description: z.string().min(1, {
				message: 'This field is required'
			}),

			incidentStart: z.date({ message: 'Invalid date string!' }).default(incidentStart),

			teamIds: z.array(z.string()),

			categoryId: z.string(),

			categoryLevelId: z.string(),

			teamEquipmentIds: z.array(z.string()),

			regionId: z.string(),

			areaId: z.string(),

			siteId: z.string(),

			faultTypeId: z.string(),

			cause: z.string().nullable(),

			technicianId: z.string().nullable(),

			serviceImpact: z.string().refine((value) => ['Yes', 'No'].includes(value), {
				message: 'Must be of one of the types'
			}),

			servicesListIds: z.array(z.string()).optional().default([]),

			attachment: z
				.instanceof(File)
				.refine((file) => file.size <= MaxAttachmentSize, {
					message: 'Max size is 5MB.'
				})
				.default(attachment),

			status: z.string().default('PENDING')
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

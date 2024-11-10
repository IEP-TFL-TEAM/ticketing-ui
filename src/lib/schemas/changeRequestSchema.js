import { z } from 'zod';
import { awarenessStatuses } from '$lib/utils';

const MaxAttachmentSize = 5242880; // 5MB

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

			involvedSystem: z.string().min(1, {
				message: 'This field is required'
			}),

			teamIds: z.array(z.string()),

			changeTeamId: z.string().nullable(),

			summary: z.string().min(1, {
				message: 'This field is required'
			}),

			servicesListIds: z.array(z.string()).optional().default([]),

			makeAwareness: z
				.string()
				.refine((value) => ['Yes', 'No'].includes(value), {
					message: 'Must be of one of the types'
				})
				.nullable(),

			awarenessToBeMade: z.array(
				z
					.string()
					.refine((value) => awarenessStatuses.includes(value), {
						message: 'Must be of one of the types'
					})
					.optional()
					.default([])
			),

			attachment: z
				.instanceof(File)
				.refine((file) => file.size <= MaxAttachmentSize, {
					message: 'Max size is 5MB.'
				})
				.default(attachment),

			status: z.string().default('PENDING'),

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
		});

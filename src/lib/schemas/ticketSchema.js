import { z } from 'zod';
import { severityLevels } from '$lib/utils';

export const ticketSchema = z
	.object({
		title: z.string().min(1, {
			message: 'This field is required'
		}),

		description: z.string().min(1, {
			message: 'This field is required'
		}),

		severity: z.string().refine((value) => severityLevels.includes(value), {
			message: 'Severity must be of one of the types'
		}),

		status: z.string().default('OPEN')
	})
	.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
		message: 'All fields are required'
	});

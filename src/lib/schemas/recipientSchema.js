import { z } from 'zod';

export const recipientSchema = () =>
	z
		.object({
			name: z.string().min(1, {
				message: 'This field is required'
			}),

			email: z.string().email({
				message: 'Invalid email address'
			}),

			type: z.string().refine((value) => ['BROADCAST', 'CC', 'AUTO'].includes(value), {
				message: 'Must be of one of the types'
			})
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

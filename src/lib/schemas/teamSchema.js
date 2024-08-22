import { z } from 'zod';

export const teamSchema = () =>
	z
		.object({
			name: z.string().min(1, {
				message: 'This field is required'
			})
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

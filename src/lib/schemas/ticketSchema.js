import { z } from 'zod';

export const ticketSchema = (faultTypeList) =>
	z
		.object({
			title: z.string().min(1, {
				message: 'This field is required'
			}),

			description: z.string().min(1, {
				message: 'This field is required'
			}),

			teamId: z.string(),

			categoryId: z.string(),

			categoryLevelId: z.string(),

			teamEquipmentId: z.string(),

			regionId: z.string(),

			areaId: z.string(),

			siteId: z.string(),

			faultTypeId: z.string(),

			status: z.string().default('PENDING')
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

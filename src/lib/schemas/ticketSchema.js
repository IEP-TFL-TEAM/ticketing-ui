import { z } from 'zod';

const AcceptedAttachmentTypes = [
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/pdf',
	'image/jpeg',
	'image/jpg',
	'image/png'
];

export const ticketSchema = (attachment) =>
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

			attachment: z
				.instanceof(File)
				.refine((file) => AcceptedAttachmentTypes.includes(file.type), {
					message: 'Only .pdf, .doc, .docx, .jpg, .png formats are supported.'
				})
				.default(attachment),

			status: z.string().default('PENDING')
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

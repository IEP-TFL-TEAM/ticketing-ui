import { z } from 'zod';

const AcceptedAttachmentTypes = [
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/pdf',
	'image/jpeg',
	'image/jpg',
	'image/png'
];

export const ticketSchema = () =>
	z
		.object({
			title: z.string().min(1, {
				message: 'This field is required'
			}),

			description: z.string().min(1, {
				message: 'This field is required'
			}),

			incidentStart: z.date({ message: 'Invalid date string!' }),

			teamIds: z.array(z.string()),

			categoryId: z.string(),

			categoryLevelId: z.string(),

			teamEquipmentIds: z.array(z.string()),

			regionId: z.string(),

			areaId: z.string(),

			siteId: z.string(),

			faultTypeId: z.string(),

			causedBy: z.string().nullable(),

			technicianId: z.string(),

			attachment: z.instanceof(File).refine((file) => AcceptedAttachmentTypes.includes(file.type), {
				message: 'Only .pdf, .doc, .docx, .jpg, .png formats are supported.'
			}),

			status: z.string().default('PENDING')
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

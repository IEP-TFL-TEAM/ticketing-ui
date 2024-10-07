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

			technicianId: z.string(),

			attachment: z
				.instanceof(File)
				.refine((file) => file.size < MaxAttachmentSize, {
					message: 'Max size is 5MB.'
				})
				.refine((file) => AcceptedAttachmentTypes.includes(file.type), {
					message: 'Only .pdf, .doc, .docx, .jpg, .png formats are supported.'
				})
				.default(attachment),

			status: z.string().default('PENDING')
		})
		.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
			message: 'All fields are required'
		});

import { z } from 'zod';

const AcceptedAttachmentTypes = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/vnd.mozilla.apng',
	'image/webp',
	'image/svg+xml',
	'image/gif'
];

export const commentSchema = z
	.object({
		content: z.string().min(1, {
			message: 'This field is required'
		}),

		attachment: z
			.instanceof(File)
			.refine((file) => AcceptedAttachmentTypes.includes(file.type), {
				message: 'Only image formats are supported.'
			})
			.nullable()
	})
	.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
		message: 'All fields are required'
	});

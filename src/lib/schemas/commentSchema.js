import { z } from 'zod';

const MaxAttachmentSize = 5000000; // 5MB

export const commentSchema = z
	.object({
		content: z.string().min(1, {
			message: 'This field is required'
		}),

		attachment: z
			.instanceof(File)
			.refine((file) => file.size < MaxAttachmentSize, {
				message: 'Max size is 5MB.'
			})
			.nullable()
	})
	.refine((obj) => Object.values(obj).every((value) => value !== undefined), {
		message: 'All fields are required'
	});

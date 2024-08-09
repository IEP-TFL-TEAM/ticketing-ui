import { getAvatarUrl } from '../getAvatarUrl';

export const parseComment = (comment) => {
	return {
		avatar: getAvatarUrl(comment.expand.userId),
		firstName: comment.expand.userId.firstName,
		lastName: comment.expand.userId.lastName,
		date: comment.created,
		content: comment.content
	};
};

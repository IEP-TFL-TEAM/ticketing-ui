export function extractMessage(message) {
	return message.replace(/<[^>]+>/g, '').trim();
}

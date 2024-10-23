export async function urlToFile(url, fetch) {
	if (!url || typeof url !== 'string' || url.trim() === '') {
		console.warn('Empty or invalid URL provided. Returning an empty file.');
		return new File([], 'empty.txt', { type: 'text/plain' });
	}

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch URL. Status: ${response.status}`);
		}

		const blob = await response.blob();
		const filename = extractFilenameFromUrl(url);
		const type = getMimeType(filename);
		const file = new File([blob], filename, { type });
		return file;
	} catch (error) {
		console.error('Error converting URL to File:', error);
		return null;
	}
}

function extractFilenameFromUrl(url) {
	try {
		const urlObj = new URL(url);
		const path = urlObj.pathname;
		const parts = path.split('/');
		return parts[parts.length - 1] || 'file';
	} catch (error) {
		console.error('Error extracting filename from URL:', error);
		return 'file';
	}
}

function getMimeType(filename) {
	const extension = filename.split('.').pop().toLowerCase();
	switch (extension) {
		case 'pdf':
			return 'application/pdf';
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'png':
			return 'image/png';
		case 'doc':
			return 'application/msword';
		case 'docx':
			return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
		default:
			return 'application/octet-stream';
	}
}

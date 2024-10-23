import pb from '$lib/api/pocketbaseClient';
import { getRoutineMaintenanceById } from '$lib/api/routineMaintenance';
import { getMembersByMaintenanceTeamId } from '$lib/api/maintenanceTeams';
import { urlToFile } from '$lib/utils/parsers';

export async function load({ params, url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	try {
		const results = await Promise.allSettled([
			pb.files.getToken(),
			getRoutineMaintenanceById(params.slug)
		]);

		const [fileToken, routine] = results.map((result) =>
			result.status === 'fulfilled' ? result.value : []
		);

		const attachmentUrl = pb.files.getUrl(routine, routine.attachment, {
			token: fileToken
		});

		const closingAttachmentUrl = pb.files.getUrl(routine, routine?.closingAttachment, {
			token: fileToken
		});

		return {
			routine,
			attachmentUrl,
			closingAttachmentUrl,
			attachment: (await urlToFile(attachmentUrl, fetch)) ?? [],
			closingAttachment: (await urlToFile(closingAttachmentUrl, fetch)) ?? [],
			members: (await getMembersByMaintenanceTeamId(routine.maintenanceTeamId)) ?? []
		};
	} catch (error) {
		console.error(error);
		return [];
	}
}

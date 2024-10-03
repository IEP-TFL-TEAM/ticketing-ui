import pb from '$lib/api/pocketbaseClient';
import { getRoutineMaintenanceById } from '$lib/api/routineMaintenance';
import { getMembersByMaintenanceTeamId } from '$lib/api/maintenanceTeams';
import { urlToFile } from '$lib/utils/parsers';

export async function load({ params, url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	const routine = (await getRoutineMaintenanceById(params.slug)) ?? [];
	const fileToken = await pb.files.getToken();
	const attachmentUrl = pb.files.getUrl(routine, routine.attachment, {
		token: fileToken
	});

	return {
		routine,
		attachmentUrl,
		attachment: (await urlToFile(attachmentUrl, fetch)) ?? [],
		members: (await getMembersByMaintenanceTeamId(routine.maintenanceTeamId)) ?? []
	};
}

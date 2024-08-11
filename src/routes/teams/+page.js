import { getTeams, getTeamUsers } from '$lib/api/teams';

export async function load() {
	return { teams: await getTeams(), users: await getTeamUsers() };
}

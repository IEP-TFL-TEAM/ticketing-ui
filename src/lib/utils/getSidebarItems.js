import {
	IconLayoutDashboard,
	IconSquareLetterI,
	IconSquareLetterC,
	IconSquareLetterM,
	IconSquareLetterT,
	IconSettings,
	IconMailForward,
	IconReport
} from '@tabler/icons-svelte';

export const getSidebarItems = (role) => {
	let sidebarItems = [];

	if (role === 'admin') {
		sidebarItems.push(
			{
				label: 'Dashboard',
				icon: IconLayoutDashboard,
				ref: '/'
			},
			{
				label: 'Incidents',
				icon: IconSquareLetterI,
				ref: '/tickets'
			},
			{
				label: 'Change Requests',
				icon: IconSquareLetterC,
				ref: '/change-requests'
			},
			{
				label: 'Routine Maintenance',
				icon: IconSquareLetterM,
				ref: '/routine-maintenance'
			},
			{
				label: 'Reports',
				icon: IconReport,
				ref: '/reports'
			},
			{
				label: 'Recipients',
				icon: IconMailForward,
				ref: '/recipients'
			},
			{
				label: 'Teams',
				icon: IconSquareLetterT,
				ref: '/teams'
			},
			{
				label: 'Settings',
				icon: IconSettings,
				ref: '/settings'
			}
		);
	} else {
		sidebarItems.push(
			{
				label: 'Dashboard',
				icon: IconLayoutDashboard,
				ref: '/'
			},
			{
				label: 'Incidents',
				icon: IconSquareLetterI,
				ref: '/tickets'
			},
			{
				label: 'Change Requests',
				icon: IconSquareLetterC,
				ref: '/change-requests'
			},
			{
				label: 'Routine Maintenance',
				icon: IconSquareLetterM,
				ref: '/routine-maintenance'
			},
			{
				label: 'Settings',
				icon: IconSettings,
				ref: '/settings'
			}
		);
	}

	return sidebarItems;
};

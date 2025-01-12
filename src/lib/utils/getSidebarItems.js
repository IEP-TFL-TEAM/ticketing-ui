import {
	IconLayoutDashboard,
	IconSquareLetterI,
	IconSquareLetterC,
	IconSquareLetterM,
	IconSettings,
	IconMailForward
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
				label: 'Maintenances',
				icon: IconSquareLetterM,
				ref: '/routine-maintenance'
			},
			{
				label: 'Recipients',
				icon: IconMailForward,
				ref: '/recipients'
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
				label: 'Maintenances',
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

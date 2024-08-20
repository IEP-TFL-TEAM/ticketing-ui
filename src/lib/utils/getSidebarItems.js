import {
	IconLayoutDashboard,
	IconTicket,
	IconSettings,
	IconAffiliate,
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
				icon: IconTicket,
				ref: '/tickets'
			},
			{
				label: 'Change Requests',
				icon: IconTicket,
				ref: '/change-requests'
			},
			{
				label: 'Routine Maintenance',
				icon: IconTicket,
				ref: '/routine-maintenance'
			},
			{
				label: 'Recipients',
				icon: IconMailForward,
				ref: '/recipients'
			},
			{
				label: 'Teams',
				icon: IconAffiliate,
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
				icon: IconTicket,
				ref: '/tickets'
			},
			{
				label: 'Change Requests',
				icon: IconTicket,
				ref: '/change-requests'
			},
			{
				label: 'Routine Maintenance',
				icon: IconTicket,
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

import { IconHome, IconTicket, IconSettings, IconAffiliate } from '@tabler/icons-svelte';

export const getSidebarItems = () => {
	const sidebarItems = [
		{
			label: 'Home',
			icon: IconHome,
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
			label: 'Teams',
			icon: IconAffiliate,
			ref: '/teams'
		},
		{
			label: 'Settings',
			icon: IconSettings,
			ref: '/settings'
		}
	];

	return sidebarItems;
};

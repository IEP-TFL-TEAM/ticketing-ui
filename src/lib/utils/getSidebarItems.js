import {
	IconLayoutDashboard,
	IconTicket,
	IconSettings,
	IconAffiliate,
	IconReport
} from '@tabler/icons-svelte';

export const getSidebarItems = () => {
	const sidebarItems = [
		{
			label: 'Dashboard',
			icon: IconLayoutDashboard,
			ref: '/'
		},
		{
			label: 'Tickets',
			icon: IconTicket,
			ref: '/tickets'
		},
		{
			label: 'Reports',
			icon: IconReport,
			ref: '/reports'
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

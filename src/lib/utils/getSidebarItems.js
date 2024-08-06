import {
	IconHome,
	IconTicket,
	IconSettings,
	IconAffiliate,
	IconReport
} from '@tabler/icons-svelte';

export const getSidebarItems = () => {
	const sidebarItems = [
		{
			label: 'Home',
			icon: IconHome,
			ref: '/'
		},
		{
			label: 'Tickets',
			icon: IconTicket,
			ref: '/tickets'
		},
		{
			label: 'Teams',
			icon: IconAffiliate,
			ref: '/teams'
		},
		{
			label: 'Reports',
			icon: IconReport,
			ref: '/reports'
		},
		{
			label: 'Settings',
			icon: IconSettings,
			ref: '/settings'
		}
	];

	return sidebarItems;
};

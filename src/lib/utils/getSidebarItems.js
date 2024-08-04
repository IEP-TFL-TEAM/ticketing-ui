import { IconHome, IconTicket, IconSettings } from '@tabler/icons-svelte';
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
			label: 'Settings',
			icon: IconSettings,
			ref: '/settings'
		}
	];

	return sidebarItems;
};

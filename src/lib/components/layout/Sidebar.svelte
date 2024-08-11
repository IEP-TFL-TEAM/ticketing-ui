<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { signOut } from '$lib/stores/auth';
	import { getSidebarItems } from '$lib/utils/getSidebarItems';
	import ThemeSwitch from './ThemeSwitch.svelte';
	import { IconArrowBarRight } from '@tabler/icons-svelte';
	import { TransparentLogo } from '$lib/assets';

	const sidebarItems = getSidebarItems();
</script>

<div
	class="sticky top-0 h-screen max-w-[17rem] bg-primary-800 text-white flex flex-col justify-between py-10 w-full px-5 overflow-y-auto"
>
	<div class="flex items-center justify-center px-2">
		<a href="/">
			<img src={TransparentLogo} alt="logo" class="w-full" />
		</a>
	</div>

	<!-- nav -->
	<nav class="flex flex-col justify-start my-20">
		{#each sidebarItems as { label, icon, ref }}
			<button
				type="button"
				on:click={() => goto(ref)}
				class={`flex w-full mb-2 space-x-5 py-2.5 px-2 rounded transition duration-200 hover:bg-primary-700 group ${
					$page.url.pathname === ref ? 'bg-primary-700 shadow-2xl text-white' : ''
				}`}
				aria-current={$page.url.pathname === ref}
			>
				<div class="flex items-center h-6">
					<svelte:component this={icon} name={icon} />
				</div>
				<p class="pl-2 tracking-wide whitespace-nowrap">{label}</p>
			</button>
		{/each}

		<button
			type="button"
			class="flex w-full mb-2 space-x-5 py-2.5 px-2 rounded transition duration-200 hover:bg-primary-700 group"
			on:click={() => signOut()}
		>
			<div class="flex items-center h-6">
				<IconArrowBarRight class="w-[1.5rem] h-[1.5rem]" />
			</div>
			<p class="pl-2 tracking-wide whitespace-nowrap">Sign out</p>
		</button>
	</nav>
	<div class="flex justify-center w-full">
		<ThemeSwitch />
	</div>
</div>

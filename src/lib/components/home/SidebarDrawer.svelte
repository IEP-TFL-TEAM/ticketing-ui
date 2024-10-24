<script>
	import { page } from '$app/stores';
	import { signOut, currentUser } from '$lib/stores/auth';
	import { getSidebarItems } from '$lib/utils/getSidebarItems';
	import ThemeSwitch from '../layout/ThemeSwitch.svelte';
	import { IconArrowBarRight } from '@tabler/icons-svelte';
	import { TransparentLogo } from '$lib/assets';

	const sidebarItems = getSidebarItems($currentUser?.role);
</script>

<div class="flex flex-col h-full w-full justify-between bg-primary-800 px-2 pb-3">
	<div>
		<div class="flex flex-col my-10 px-4 gap-4">
			<a href="/app">
				<img src={TransparentLogo} alt="logo" class="w-fulL" />
			</a>

			<span class="badge variant-filled uppercase">
				{$currentUser?.role} Portal
			</span>
		</div>

		<!-- nav -->
		<nav class="flex flex-col justify-start px-6">
			{#each sidebarItems as { label, icon, ref }}
				<a
					href={ref}
					class={`flex w-full mb-2 space-x-5 py-2.5 px-2 rounded transition duration-200 hover:bg-primary-700 group ${
						$page.url.pathname === ref ? 'bg-primary-700 shadow-2xl text-white' : ''
					}`}
					aria-current={$page.url.pathname === ref}
				>
					<div class="flex items-center h-6">
						<svelte:component this={icon} name={icon} />
					</div>
					<p class="pl-2 tracking-wide whitespace-nowrap">{label}</p>
				</a>
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
	</div>

	<div class="flex justify-center w-full">
		<ThemeSwitch />
	</div>
</div>

<script>
	import { signIn, currentUser } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { TransparentLogo } from '$lib/assets';
	import { IconLogin2 } from '@tabler/icons-svelte';

	const toastStore = getToastStore();

	let email;
	let password;
	let loading = false;

	async function handleLogin() {
		loading = true;
		try {
			const { error } = await signIn(email, password);
			if (error) throw error;
			goto('/');
			toastStore.clear();
		} catch (error) {
			toastStore.trigger({
				message: error.error_description || error.message,
				background: 'bg-[#252424] text-white',
				classes: 'border-l-4 border-red-500 shadow-2xl transition',
				timeout: 3000
			});
		}
		loading = false;
	}

	$: if ($currentUser) {
		goto('/');
	}
</script>

<div class="flex flex-col items-center justify-center w-full min-h-screen bg-neutral-50">
	<div
		class="flex flex-col w-full max-w-lg px-4 py-8 bg-white shadow-2xl sm:px-6 md:px-8 lg:px-10 rounded"
	>
		<div class="flex justify-center items-center">
			<img src={TransparentLogo} class="p-8" alt="_" />
		</div>

		<div class="self-center text-xl font-bold text-center text-gray-800 uppercase sm:text-2xl mt-4">
			NOC Ticketing Portal
		</div>

		<div class="relative h-px my-10 bg-gray-300">
			<div class="absolute top-0 left-0 flex justify-center w-full -mt-2">
				<span class="px-4 text-xs text-gray-500 uppercase bg-white"> Login With Email </span>
			</div>
		</div>
		<form on:submit|preventDefault={handleLogin}>
			<div class="max-w-sm mx-auto">
				<input
					class="w-full px-8 py-4 text-sm font-medium text-black placeholder-gray-500 border border-gray-200 rounded bg-neutral-50 focus:outline-none focus:border-gray-400 focus:bg-white"
					placeholder="Email"
					bind:value={email}
					type="email"
					name="email"
					required
				/>

				<input
					class="w-full px-8 py-4 mt-5 text-sm font-medium text-black placeholder-gray-500 border border-gray-200 rounded bg-neutral-50 focus:outline-none focus:border-gray-400 focus:bg-white"
					type="password"
					name="password"
					bind:value={password}
					placeholder="Password"
					required
				/>
				<button
					class="flex items-center justify-center w-full py-4 my-8 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out rounded bg-primary-500 text-white-500 hover:bg-primary-700 focus:shadow-outline focus:outline-none gap-x-4"
					type="submit"
					disabled={loading}
				>
					<IconLogin2 class="w-6 h-6 -ml-2" />
					<span> Login </span>
				</button>
			</div>
		</form>
	</div>
</div>

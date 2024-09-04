<script>
	import { signIn, currentUser } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { TransparentLogo } from '$lib/assets';

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
				classes: 'hover:scale-110 border-l-4 border-red-500 shadow-2xl transition'
			});
		}
		loading = false;
	}

	$: if ($currentUser) {
		goto('/');
	}
</script>

<svelte:head>
	<title>Login Page</title>
</svelte:head>

<div class="min-h-screen w-full flex flex-col items-center justify-center bg-white">
	<div
		class="flex flex-col bg-white shadow-2xl px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-14 rounded-md w-full max-w-md"
	>
		<div class="flex justify-center items-center">
			<img src={TransparentLogo} alt="logo" />
		</div>
		<div
			class="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800 text-center pt-5"
		>
			<span class="font-extrabold"> TFL NOC Ticketing System </span>
		</div>
		<div class="relative mt-10 h-px bg-gray-300">
			<div class="absolute left-0 top-0 flex justify-center w-full -mt-2">
				<span class="bg-white px-4 text-xs text-gray-500 uppercase"> Login With Email </span>
			</div>
		</div>
		<form on:submit|preventDefault>
			<div class="flex flex-col mb-6 mt-10">
				<div class="relative mt-2">
					<div
						class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400"
					></div>
					<input
						id="email"
						type="text"
						placeholder=" "
						bind:value={email}
						class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-400 appearance-none focus:outline-none focus:border-red-400 peer"
					/>
					<label
						for="email"
						class="absolute left-3 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-1 z-10 bg-white px-2peer-focus:px-2 peer-focus:text-red-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4"
					>
						Email
					</label>
				</div>
			</div>
			<div class="flex flex-col mb-6">
				<label for="password" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"></label>
				<div class="relative mt-2">
					<div
						class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400"
					></div>
					<input
						id="password"
						type="password"
						placeholder=" "
						bind:value={password}
						class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-400 appearance-none focus:outline-none focus:border-red-400 peer"
					/>
					<label
						for="password"
						class="absolute left-3 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-1 z-10 bg-white px-2peer-focus:px-2 peer-focus:text-red-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4"
					>
						Password
					</label>
				</div>
			</div>
			<div class="flex w-full">
				<button
					type="submit"
					class="btn variant-filled-primary rounded py-2 w-full hover:scale-105"
					on:click={() => handleLogin()}
					disabled={loading}
				>
					<span class="mr-2 uppercase">Login</span>
					<span>
						<svg
							class="h-6 w-6"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</span>
				</button>
			</div>
		</form>
	</div>
</div>

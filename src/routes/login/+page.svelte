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

<div
	class="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-primary-900 via-tertiary-800 to-secondary-600"
>
	<div
		class="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md"
	>
		<div class="flex justify-center items-center">
			<img src={TransparentLogo} alt="logo" />
		</div>

		<div
			class="font-medium self-center text-xl sm:text-2xl uppercase text-neutral-800 text-center pt-5"
		>
			<span class="font-extrabold"> TFL NOC Ticketing System </span>
		</div>
		<div class="relative mt-10 h-px bg-neutral-300">
			<div class="absolute left-0 top-0 flex justify-center w-full -mt-2">
				<span class="bg-white px-4 text-xs text-neutral-500 uppercase"> Login With Email </span>
			</div>
		</div>
		<form on:submit|preventDefault>
			<div class="flex flex-col mb-6 mt-10">
				<label for="email" class="mb-1 text-xs sm:text-sm tracking-wide text-neutral-600">
					E-Mail Address:
					<div class="relative mt-2">
						<div
							class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-neutral-400"
						>
							<svg
								class="h-6 w-6"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
								/>
							</svg>
						</div>

						<input
							class="text-sm sm:text-base placeholder-neutral-500 pl-10 pr-4 rounded-lg border border-neutral-400 w-full py-2 focus:outline-none focus:border-red-400"
							placeholder="Email"
							type="text"
							bind:value={email}
						/>
					</div>
				</label>
			</div>
			<div class="flex flex-col mb-6">
				<label for="password" class="mb-1 text-xs sm:text-sm tracking-wide text-neutral-600">
					Password:
					<div class="relative mt-2">
						<div
							class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-neutral-400"
						>
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
									<path
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</span>
						</div>

						<input
							placeholder="Password"
							type="password"
							bind:value={password}
							class="text-sm sm:text-base placeholder-neutral-500 pl-10 pr-4 rounded-lg border border-neutral-400 w-full py-2 focus:outline-none focus:border-red-400"
						/>
					</div>
				</label>
			</div>

			<div class="flex w-full">
				<button
					type="submit"
					class="btn variant-filled-primary rounded py-2 w-full"
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
		<div class="mt-10" />
	</div>
</div>

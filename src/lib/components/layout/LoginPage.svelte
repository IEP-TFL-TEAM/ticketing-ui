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

<svelte:head>
	<title>Login Page</title>
</svelte:head>

<div
	class="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 w-full min-h-screen bg-[#252424]"
>
	<div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image:
					url(https://www.telecom.com.fj/wp-content/uploads/2019/04/shutterstock_444595702.jpg);"
		/>

		<div class="relative z-20 flex items-center text-lg font-medium">
			<img src={TransparentLogo} class="h-24" alt="_" />
		</div>

		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">&ldquo;The World at your fingertips&rdquo;</p>

				<footer class="text-sm">Telecom Fiji Limited</footer>
			</blockquote>
		</div>
	</div>

	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-4 text-center">
				<h1 class="text-2xl font-semibold tracking-tight text-tertiary-500 uppercase">
					NOC Ticketing Portal
				</h1>
				<p class="text-white text-sm uppercase">Login with Email</p>
			</div>

			<form on:submit|preventDefault={() => handleLogin()}>
				<div class="max-w-sm mx-auto">
					<input
						class="w-full px-8 py-4 text-sm font-medium text-white placeholder-gray-500 border border-gray-200/40 rounded bg-transparent focus:outline-none focus:border-gray-400"
						placeholder="Email"
						bind:value={email}
						type="email"
						name="email"
						required
					/>

					<input
						class="w-full px-8 py-4 mt-5 text-sm font-medium text-white placeholder-gray-500 border border-gray-200/40 rounded bg-transparent focus:outline-none focus:border-gray-400"
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
						Login
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

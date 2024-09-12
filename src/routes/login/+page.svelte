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

	const inputStyles =
		'w-full bg-transparent text-white border-0 border-b-2 border-neutral-500 outline-0 focus:outline-none focus:ring-0 focus:shadow-none py-2 focus:border-tertiary-500 focus:border-b-2 transition-colors peer';
	const labelStyles =
		'absolute peer-focus:left-0 top-2 text-neutral-500 cursor-text peer-focus:-top-5 peer-focus:text-tertiary-500 font-bold transition-all';
</script>

<svelte:head>
	<title>Login Page</title>
</svelte:head>

<div class="min-h-screen w-full flex flex-col items-center justify-center bg-[#252424]">
	<div class="flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-14 w-full max-w-md gap-y-10">
		<div class="flex flex-col gap-y-4">
			<div class="w-full flex justify-center">
				<img src={TransparentLogo} alt="logo" />
			</div>

			<h1 class="h1 font-extrabold text-xl sm:text-2xl text-tertiary-500 text-center">
				Welcome to NOC <br /> Ticketing
			</h1>
		</div>

		<form class="flex flex-col gap-y-6 px-4" on:submit|preventDefault={() => handleLogin()}>
			<div class="relative">
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class={inputStyles}
					autocomplete="off"
				/>
				<label
					for="email"
					class={`${labelStyles} ${
						!email || email.length === 0 ? 'left-2' : 'left-0 -top-5 text-tertiary-500'
					}`}
				>
					{!email || email.length === 0 ? 'Email' : ''}
				</label>
			</div>

			<div class="relative">
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class={inputStyles}
					autocomplete="off"
				/>
				<label
					for="password"
					class="{labelStyles} {!password || password.length === 0
						? 'left-2'
						: 'left-0 -top-5 text-tertiary-500'}"
				>
					{!password || password.length === 0 ? 'Password' : ''}
				</label>
			</div>

			<div class="flex w-full mt-4">
				<button
					type="submit"
					class="btn rounded-full py-2 w-full font-bold bg-gradient-to-r from-primary-500 to-tertiary-500 text-white focus:outline-none"
					disabled={loading}
				>
					Login
				</button>
			</div>
		</form>
	</div>
</div>

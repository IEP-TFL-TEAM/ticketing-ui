<script>
	import pb from '$lib/api/pocketbaseClient';
	import { get } from 'svelte/store';
	import { currentUser } from '$lib/stores/auth';
	import { getAvatarUrl } from '$lib/utils/getAvatarUrl';
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
	import { IconUpload } from '@tabler/icons-svelte';
	import { IconTrash } from '@tabler/icons-svelte';

	let loading = false;
	let showOldPassword = false;
	let showPassword = false;
	let showPasswordConfirm = false;
	let timeOutValue = 3000;

	const oldPassword = '';
	const password = '';
	const passwordConfirm = '';

	const toastStore = getToastStore();

	async function removeAvatar() {
		loading = true;

		const user = get(currentUser);
		if (!user) throw new Error('Current user not available');

		try {
			const userId = user?.id;

			await pb.collection('users').update(userId, { avatar: null });
			avatar = null;

			toastStore.trigger({
				message: 'Avatar removed successfully.',
				timeout: timeOutValue,
				background: 'variant-filled-success',
				classes: 'rounded-none font-semibold'
			});
		} catch (error) {
			toastStore.trigger({
				message: 'Error removing avatar.',
				timeout: timeOutValue
			});
		} finally {
			loading = false;
		}
	}

	async function updateAvatar(event) {
		loading = true;

		const user = get(currentUser);
		if (!user) throw new Error('Current user not available');

		const inputElement = event.target;
		if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
			loading = false;
			return;
		}
		const file = event.target.files[0];
		try {
			const userId = user?.id;

			const formData = new FormData();
			formData.append('avatar', file);

			const updatedUser = await pb.collection('users').update(userId, formData);

			$currentUser = updatedUser;

			toastStore.trigger({
				message: 'Avatar updated successfully.',
				timeout: timeOutValue,
				background: 'variant-filled-success',
				classes: 'rounded-none font-semibold'
			});
		} catch (error) {
			toastStore.trigger({
				message: 'Error updating avatar.',
				timeout: timeOutValue
			});
		} finally {
			loading = false;
		}
	}

	async function updatePassword(event) {
		loading = true;
		const user = get(currentUser);
		if (!user) {
			throw new Error('Current user not available');
		}

		let passwordFormData;

		try {
			const userId = user.id;

			const formData = new FormData(event.target);
			const data = Object.fromEntries(formData);

			if (!data.password || !data.passwordConfirm) {
				throw new Error('Both password and password confirm fields are required');
			}

			if (data.password !== data.passwordConfirm) {
				throw new Error('New Password & Confirm Password must match!');
			}
			passwordFormData = new FormData();
			passwordFormData.append('password', data.password);
			passwordFormData.append('passwordConfirm', data.passwordConfirm);

			await pb.collection('users').update(userId, passwordFormData);

			toastStore.trigger({
				message: 'Password Successfully Changed',
				timeout: timeOutValue,
				background: 'variant-filled-success',
				classes: 'rounded-none font-semibold'
			});
		} catch (error) {
			toastStore.trigger({
				message: `Error updating password.`,
				timeout: timeOutValue,
				background: 'variant-filled-error'
			});
		} finally {
			loading = false;
		}
	}

	$: avatar = getAvatarUrl($currentUser) ?? null;
</script>

<div class="bg-white dark:bg-transparent py-20">
	<div class="mx-auto max-w-2xl text-center">
		<span class="text-xl font-semibold tracking-wide"> -- General -- </span>
		<h2 class="text-3xl font-extrabold sm:text-4xl">Settings</h2>
		<p class="mt-2 text-lg leading-8">Manage your general account information</p>
	</div>

	<form
		class="mx-auto mt-16 max-w-xl sm:mt-18"
		enctype="multipart/form-data"
		on:submit|preventDefault={(event) => updatePassword(event)}
	>
		<div class="-mt-5 flex flex-col py-4 gap-y-4 mb-4 justify-center items-center">
			<Avatar
				src={avatar}
				initials={$currentUser?.firstName.charAt(0) + $currentUser?.lastName.charAt(0)}
				width="w-32"
				rounded="rounded-full"
				border="border-4 border-gray-300 dark:border-gray-500 hover:border-primary-500 dark:hover:border-tertiary-500"
				background="bg-transparent"
			/>

			<h3 class=" font-semibold tracking-wide">
				{$currentUser?.firstName + ' ' + $currentUser?.lastName}
			</h3>

			<div class="flex gap-x-2">
				{#if avatar}
					<button
						type="button"
						class="hover:cursor-pointer hover:scale-110"
						on:click={() => removeAvatar()}
					>
						<IconTrash />
					</button>
				{/if}

				<label for="avatar" class="hover:cursor-pointer hover:scale-110">
					<input
						type="file"
						id="avatar"
						name="avatar"
						class="hidden w-0"
						value=""
						accept="image/*"
						on:change={(event) => updateAvatar(event)}
					/>
					<span class="">
						<IconUpload />
					</span>
				</label>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
			<div>
				<label for="firstName" class="block text-sm font-semibold leading-6 text-center">
					First name
				</label>

				<div class="mt-2.5">
					<input
						class=" block w-full rounded-md input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
						type="text"
						placeholder={$currentUser?.firstName}
						readonly
					/>
				</div>
			</div>
			<div>
				<label for="lastName" class="block text-sm font-semibold leading-6 text-center">
					Last name
				</label>
				<div class="mt-2.5">
					<input
						class=" block w-full rounded-md input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
						type="text"
						placeholder={$currentUser?.lastName}
						readonly
					/>
				</div>
			</div>

			<div>
				<label for="userid" class="block text-sm font-semibold leading-6 text-center">
					User UUID
				</label>
				<div class="mt-2.5">
					<input
						class=" block w-full rounded-md input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
						type="text"
						placeholder={$currentUser?.id}
						readonly
					/>
				</div>
			</div>

			<div>
				<label for="username" class="block text-sm font-semibold leading-6 text-center">
					Username
				</label>

				<div class="mt-2.5">
					<input
						class=" block w-full rounded-md input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
						type="text"
						placeholder={$currentUser?.username}
						readonly
					/>
				</div>
			</div>

			<div class="sm:col-span-2">
				<label for="email" class="block text-sm font-semibold leading-6 text-center">
					<span> Email address </span>
				</label>
				<div class="mt-2.5">
					<input
						class=" block w-full rounded-md input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
						type="email"
						placeholder={$currentUser?.email}
						readonly
					/>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mt-4">
			<div>
				<label for="oldPassword" class="block text-sm font-semibold leading-6 text-center">
					<span> Old Password </span>
				</label>
				<div class="mt-2.5 relative">
					<input
						type={showOldPassword ? 'text' : 'password'}
						value={oldPassword}
						name="oldPassword"
						required
						class="block w-full rounded-md input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center hover:scale-105"
					/>
					<span class="absolute inset-y-0 right-0 pr-3 flex items-center">
						{#if showOldPassword}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13.875 12.875l-2.25 2.25m5.625-5.625l-2.25 2.25"
								/>
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M3 14l5-5m0 0l5 5m5-5l-5 5" />
							</svg>
						{/if}
					</span>
				</div>
			</div>
			<div>
				<label for="newPassword" class="block text-sm font-semibold leading-6 text-center">
					<span> New Password </span>
				</label>
				<div class="mt-2.5 relative">
					<input
						type={showPassword ? 'text' : 'password'}
						value={password}
						name="password"
						required
						class="block w-full rounded-md input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center hover:scale-105"
					/>
				</div>
			</div>
			<div class="sm:col-span-2">
				<label for="passwordConfirm" class="block text-sm font-semibold leading-6 text-center">
					<span> Confirm Password </span>
				</label>
				<div class="mt-2.5 relative">
					<input
						type={showPasswordConfirm ? 'text' : 'password'}
						value={passwordConfirm}
						name="passwordConfirm"
						required
						class="block w-full rounded-md input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center hover:scale-105"
					/>
				</div>
			</div>
		</div>

		<div class="flex items-center space-x-4 mt-6 justify-center">
			<button
				type="submit"
				class="btn rounded-md variant-filled-primary dark:variant-filled-tertiary w-full hover:scale-105"
				disabled={loading}
			>
				{loading ? 'Updating ...' : 'Update'}
			</button>
		</div>
	</form>
</div>

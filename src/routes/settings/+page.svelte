<script>
	import pb from '$lib/api/pocketbaseClient';
	import { get } from 'svelte/store';
	import { currentUser, signOut } from '$lib/stores/auth';
	import { getAvatarUrl } from '$lib/utils/getAvatarUrl';
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
	import { IconUpload } from '@tabler/icons-svelte';

	let loading = false;
	let showOldPassword = false;
	let showPassword = false;
	let showPasswordConfirm = false;
	let timeOutValue = 2000;

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
				background: 'variant-filled-success'
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

		const file = event.target.files[0];
		if (!file) return;

		try {
			const userId = user?.id;

			const formData = new FormData();
			formData.append('avatar', file);

			const updatedUser = await pb.collection('users').update(userId, formData);

			$currentUser = updatedUser;

			toastStore.trigger({
				message: 'Avatar updated successfully.',
				timeout: timeOutValue,
				background: 'variant-filled-success'
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

		if ($currentUser) throw new Error('Current user not available');

		try {
			const userId = user?.id;

			const formData = new FormData(event.target);
			const data = Object.fromEntries(formData);

			const userRecord = await pb.collection('users').getFirstListItem(`id="${userId}"`);

			if (data.password !== data.passwordConfirm) {
				throw new Error('New Password & Confirm Password must match!');
			}

			await pb.collection('users').authWithPassword(userRecord.email, data.oldPassword);

			await pb.collection('users').update(userId, {
				oldPassword: data.oldPassword,
				password: data.password,
				passwordConfirm: data.passwordConfirm
			});

			await signOut();

			toastStore.trigger({
				message: 'Password Successfully Changed',
				timeout: timeOutValue,
				background: 'variant-filled-success'
			});
		} catch (error) {
			toastStore.trigger({
				message: error.status === 400 ? 'Old Password Incorrect!' : error.message,
				timeout: timeOutValue,
				background: 'variant-filled-error'
			});
		} finally {
			loading = false;
		}
	}

	$: avatar = getAvatarUrl($currentUser) ?? null;
</script>

<div class=" px-6 py-[4rem] sm:py-[6rem] lg:px-8 bg-white dark:bg-inherit h-screen">
	<div class="mx-auto max-w-2xl text-center">
		<span class="text-xl font-semibold tracking-wide"> -- General -- </span>
		<h2 class="text-3xl font-extrabold sm:text-4xl">Settings</h2>
		<p class="mt-2 text-lg leading-8">Manage your general account information</p>
	</div>

	<form
		class="mx-auto mt-16 max-w-xl sm:mt-18"
		enctype="multipart/form-data"
		on:submit|preventDefault={() => updatePassword()}
	>
		<div class=" -mt-5 flex flex-col justify-center items-center py-4 gap-y-4 mb-4">
			<Avatar
				src={avatar}
				initials={$currentUser?.firstName.charAt(0) + $currentUser?.lastName.charAt(0)}
				width="w-32"
				rounded="rounded-full"
				border="border-4 border-gray-300 dark:border-gray-500 hover:!border-secondary-500 dark:hover:border-primary-500"
				background="bg-transparent"
			/>

			<h3 class=" font-semibold tracking-wide">
				{$currentUser?.firstName + ' ' + $currentUser?.lastName}
			</h3>

			<div class="flex gap-x-2">
				{#if avatar}
					<button type="button" class="btn variant-ghost-primary" on:click={() => removeAvatar()}>
						Remove Avatar
					</button>
				{/if}

				<label
					for="avatar"
					class="btn rounded-none variant-outline-primary dark:variant-outline-secondary hover:cursor-pointer flex justify-center items-center"
				>
					<input
						type="file"
						id="avatar"
						name="avatar"
						class="hidden"
						value=""
						accept="image/*"
						on:change={() => updateAvatar()}
					/>
					<span>
						<IconUpload />
					</span>
				</label>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
			<div>
				<label for="firstName" class="block text-sm font-semibold leading-6 text-center">
					First Name
				</label>

				<div class="mt-2.5">
					<input
						class=" input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
						type="text"
						placeholder={$currentUser?.firstName}
						readonly
					/>
				</div>
			</div>
			<div>
				<label for="lastName" class="block text-sm font-semibold leading-6 text-center">
					Last Name
				</label>
				<div class="mt-2.5">
					<input
						class=" input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
						type="text"
						placeholder={$currentUser?.lastName}
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
						class=" input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
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
						class="input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
					/>
					<button
						class="absolute right-0 top-[10px] mr-2 focus:outline-none"
						type="button"
						on:click={() => (showOldPassword = !showOldPassword)}
					>
						{#if showOldPassword}
							Hide
						{:else}
							Show
						{/if}
					</button>
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
						class="input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
					/>
					<button
						class="absolute right-0 top-[10px] mr-2 focus:outline-none"
						type="button"
						on:click={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							Hide
						{:else}
							Show
						{/if}
					</button>
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
						class="input placeholder:text-center placeholder:font-bold placeholder:tracking-widest text-center"
					/>
					<button
						class="absolute right-0 top-[10px] mr-2 focus:outline-none"
						type="button"
						on:click={() => (showPasswordConfirm = !showPasswordConfirm)}
					>
						{#if showPasswordConfirm}
							Hide
						{:else}
							Show
						{/if}
					</button>
				</div>
			</div>
		</div>

		<div class="flex items-center space-x-4 mt-6 justify-center">
			<button
				type="submit"
				class="btn rounded-none variant-filled-primary dark:variant-filled-secondary w-full"
				disabled={loading}
			>
				{!loading ? 'Update' : 'Updating ...'}
			</button>
		</div>
	</form>
</div>

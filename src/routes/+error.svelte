<script>
	import { page } from '$app/stores';
	import { TransparentLogo } from '$lib/assets';
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div>
	<div class="flex flex-col items-center justify-center w-full min-h-screen bg-surface-900">
		<div
			class="flex flex-col w-full max-w-lg px-4 py-8 bg-white shadow-2xl sm:px-6 md:px-8 lg:px-10 rounded-md"
		>
			<div class="w-full m-5">
				<img src={TransparentLogo} class="" alt="_" />
			</div>

			{#if $page.status === 404}
				<div class="max-w-screen-sm mx-auto text-center">
					<h1
						class="mb-4 text-4xl font-extrabold tracking-tight lg:text-6xl text-primary-600 dark:text-primary-500"
					>
						Page Not Found
					</h1>

					<p class="mb-4 text-lg font-light text-neutral-500 dark:text-neutral-400">
						Sorry, we can't find that page. You can find more information on our Home Page.
					</p>
					<a
						href="/"
						class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
					>
						Back to Home
					</a>
				</div>
			{:else}
				<div class="max-w-screen-sm mx-auto text-center">
					<h1
						class="mb-4 text-4xl font-extrabold tracking-tight lg:text-6xl text-primary-600 dark:text-primary-500"
					>
						Something Went Wrong!
					</h1>

					<p class="mb-4 text-lg font-light text-neutral-500 dark:text-neutral-400">
						Our team has been notified, and will be working on resolving the issue.
					</p>
					<a
						href="/"
						class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
					>
						Back to Home
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>

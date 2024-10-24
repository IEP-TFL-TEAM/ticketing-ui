<script>
	export let emails = [];
	export let loading;

	let inputValue = '';

	function addEmail() {
		if (emails.includes(inputValue)) {
			inputValue = '';
		}
		if (inputValue && isValidEmail(inputValue) && !emails.includes(inputValue)) {
			emails = [...emails, inputValue];
			inputValue = '';
		}
	}

	function removeEmail(email) {
		emails = emails.filter((e) => e !== email);
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addEmail();
		}
	}

	function isValidEmail(email) {
		// Basic email validation regex
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
</script>

<div class="border border-gray-300 dark:border-gray-200/30 rounded flex flex-wrap">
	<div class="flex flex-wrap">
		{#each emails as email}
			<span class="bg-surface-100 text-gray-700 rounded px-2 py-1 m-1 text-xs flex items-center">
				{email}
				<button
					on:click={() => removeEmail(email)}
					class="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
				>
					×
				</button>
			</span>
		{/each}
	</div>
	<input
		type="text"
		bind:value={inputValue}
		on:keydown={handleKeydown}
		on:blur={addEmail}
		disabled={loading}
		placeholder="Enter email addresses separated by comma. Press enter to add to list."
		class="input max-w-60 !bg-white dark:!bg-neutral-800 placeholder-primary-500 dark:placeholder-tertiary-500 rounded-none text-sm flex-grow !border-none !focus:outline-none !focus:ring-0 !focus:ring-offset-0"
	/>
</div>

<script>
	import { onMount } from 'svelte';
	import { modeCurrent, setModeCurrent, setModeUserPrefers } from '@skeletonlabs/skeleton';
	import { IconSun, IconMoon } from '@tabler/icons-svelte';

	function toggleTheme() {
		$modeCurrent = !$modeCurrent;
		setModeCurrent($modeCurrent);
		setModeUserPrefers($modeCurrent);
	}

	onMount(() => {
		$modeCurrent === setModeCurrent($modeCurrent) ?? setModeCurrent(!$modeCurrent);
	});
</script>

<button
	class=" bg-white text-black dark:text-white hover:bg-white hover:text-black dark:hover:text-white flex items-center justify-center transition-all dark:bg-[#252424] dark:hover:bg-gray-950/50"
	on:click={() => toggleTheme()}
>
	<svelte:component
		this={$modeCurrent ? IconSun : IconMoon}
		name={$modeCurrent ? IconSun : IconMoon}
		class="w-[1.5rem] h-[1.5rem] transition-all"
	/>
</button>

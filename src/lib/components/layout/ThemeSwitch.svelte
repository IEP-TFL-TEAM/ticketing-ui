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
	class=" bg-white text-black dark:text-white hover:bg-white hover:text-black dark:hover:text-white w-[4rem] h-[4rem] bg-opacity-80 backdrop-blur-[0.5rem] border dark:border-white border-black border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-[#252424] dark:hover:bg-neutral-950/50 group"
	on:click={() => toggleTheme()}
>
	<svelte:component
		this={$modeCurrent ? IconSun : IconMoon}
		name={$modeCurrent ? IconSun : IconMoon}
		class="w-[1.5rem] h-[1.5rem] group-hover:scale-125 transition-all"
	/>
</button>

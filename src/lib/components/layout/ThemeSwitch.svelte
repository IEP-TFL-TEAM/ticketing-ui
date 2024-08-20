<script>
	import { onMount } from 'svelte';
	import {
		modeCurrent,
		setModeCurrent,
		setModeUserPrefers,
		SlideToggle
	} from '@skeletonlabs/skeleton';

	function toggleTheme() {
		$modeCurrent = !$modeCurrent;
		setModeCurrent($modeCurrent);
		setModeUserPrefers($modeCurrent);
	}

	onMount(() => {
		$modeCurrent === setModeCurrent($modeCurrent) ?? setModeCurrent(!$modeCurrent);
	});
</script>

<SlideToggle name="slide" bind:checked={$modeCurrent} on:click={() => toggleTheme()} />

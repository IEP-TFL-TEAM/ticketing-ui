<script>
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	let ticket = $drawerStore.meta;
</script>

<p>Editing ticket {ticket.title}</p>

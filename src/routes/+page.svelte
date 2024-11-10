<script>
</script>

<svelte:head>
	<title>Welcome to the System</title>
</svelte:head>

<div class="container flex flex-col mx-auto">
	<div class="flex flex-col mt-5 gap-y-2">
		<h1 class="h1 font-extrabold">Welcome to the TFL NOC Ticketing System</h1>
		<p>Navigate through the system with options on the sidebar</p>
	</div>

	<div class="flex w-full h-[3000px]">
		<!-- Change url accordingly to the deployed metabase instance -->

		<!-- Josed's Dev Dashboard -->
		<!-- src="http://localhost:3000/public/dashboard/c5f4cdd5-a7c3-4637-8016-0bfdd1f6630e" -->
		<iframe
			title="Ticketing Dashboard"
			src="http://192.168.20.2:3001/public/dashboard/01737b4c-2560-449a-b8ea-90a3590a2f43"
			frameborder="0"
			allowtransparency
			class="flex-grow h-full"
		/>
	</div>
</div>

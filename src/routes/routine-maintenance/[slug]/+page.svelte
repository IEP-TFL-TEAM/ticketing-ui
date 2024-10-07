<script>
	import { onDestroy, onMount } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import { lazyLoad } from '$lib/actions/lazyLoad.js';
	import { parseDateAndTime } from '$lib/utils/parsers/parseDateAndTime';
	import { expand } from '$lib/api/routineMaintenance';
	import { IconArrowNarrowLeft, IconDownload, IconMaximize, IconEdit } from '@tabler/icons-svelte';

	export let data;

	$: ({ routine, attachmentUrl, attachment, members } = data);

	$: isOfTypeDoc =
		(attachment.type !== 'image/jpg') &
		(attachment.type !== 'image/png') &
		(attachment.type !== 'image/jpeg');

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	function onClickView(imageSrc) {
		modalStore.trigger({
			type: 'component',
			component: 'viewImage',
			backdropClasses: '!bg-black/80',
			meta: { imageSrc }
		});
	}

	function onClickViewFile(fileSrc) {
		modalStore.trigger({
			type: 'component',
			component: 'viewFile',
			backdropClasses: '!bg-black/80',
			meta: { fileSrc }
		});
	}

	function editApplication(routine) {
		modalStore.trigger({
			type: 'component',
			component: 'editRoutineMaintenance',
			backdropClasses: '!bg-black/50',
			meta: { routine, attachment }
		});
	}

	function extractMessage(message) {
		return message.replace(/<[^>]+>/g, '').trim();
	}

	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('routinemaintenance').subscribe(
			routine.id,
			async (e) => {
				toastStore.trigger({
					message: `A form has been ${e.action}d!`,
					timeout: 3000
				});

				routine = e.record;
			},
			{
				expand
			}
		);
	});

	onDestroy(() => {
		unSubscribe?.();
	});

	const colStyles =
		'p-6 border border-gray-20 dark:border-white/30 rounded divide-x-2 divide-black/10 dark:divide-white/30 bg-white dark:bg-neutral-900';
	const divideStyles = 'divide-y-2 divide-black/20 dark:divide-white/50';
	const spanStyles = 'text-primary-600 dark:text-tertiary-500';
	const tableHeaderStyles = 'px-6 font-semibold py-2';
	const tdStyles = 'px-6 py-4';
</script>

<div class="w-full mt-5 break-words">
	<div class="flex justify-between items-center mb-8">
		<a href="/routine-maintenance" class="-ml-2">
			<IconArrowNarrowLeft size={40} />
		</a>

		<button
			type="button"
			on:click={() => editApplication(routine)}
			class=" border border-black/30 dark:border-white/30 flex py-2.5 px-8 gap-x-1 items-center justify-center rounded uppercase font-semibold bg-white dark:bg-neutral-900"
		>
			<span>
				<IconEdit />
			</span>
			<span>Edit Routine</span>
		</button>
	</div>

	<div class="grid grid-cols-1 gap-1 pl-4 mt-4 lg:grid-cols-4 auto-rows-auto">
		<div class={colStyles + ' lg:col-span-2 lg:row-span-2'}>
			<div class={divideStyles}>
				<h4 class="mb-2 h4">Routine Maintenance Information</h4>

				<div class="flex flex-col gap-2 pt-4">
					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Ticket #: </span>
						<span class={spanStyles}>{routine.ticketNumber}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Title: </span>
						<span class={spanStyles}>{routine.title}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Objective: </span>
						<span class={spanStyles}>{routine.objective}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Service Impact: </span>
						<span class={spanStyles}>{routine.serviceImpact}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Duration: </span>
						<span class={spanStyles}>{routine.duration} minutes</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Task Site: </span>
						<span class={spanStyles}>{routine.expand?.siteId?.name ?? 'N/A'}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 my-4">
						<span> Technical Group(s) Involved: </span>

						<ol class="list {spanStyles}">
							{#each routine.expand?.teamIds as { name }, idx}
								<li>
									<span>{idx + 1}.</span>
									<span class="flex-auto">{name}</span>
								</li>
							{/each}
						</ol>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Maintenance Team: </span>
						<span class={spanStyles}>{routine.expand?.maintenanceTeamId?.name ?? 'N/A'}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Risk Aversion: </span>
						<span class={spanStyles}>{extractMessage(routine.riskAversion)}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Summarized Scope of Work: </span>
						<span class={spanStyles}>{extractMessage(routine.scopeOfWork)}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Maintenance Risks: </span>
						<span class={spanStyles}>{extractMessage(routine.maintenanceRisks)}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Maintenance Pre-Checklist: </span>
						<span class={spanStyles}>{extractMessage(routine.maintenancePreChecklist)}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Maintenance Outcome: </span>
						<span class={spanStyles}>{extractMessage(routine.maintenanceOutcome)}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> List Of Services: </span>
						<span class={spanStyles}>{extractMessage(routine.listOfServices)}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Awareness To Be Made: </span>
						<span class={spanStyles}>{routine.awarenessToBeMade}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="{colStyles} lg:col-span-2">
			<div class={divideStyles}>
				<h4 class="mb-2 h4">Date Information</h4>

				<div class="flex flex-col pt-4 gap-y-2">
					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Date: </span>
						<span class={spanStyles}>{parseDateAndTime(routine.date)}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Start Date: </span>
						<span class={spanStyles}>{parseDateAndTime(routine.startDate)}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> End Date: </span>
						<span class={spanStyles}>{parseDateAndTime(routine.endDate)}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Created At: </span>
						<span class={spanStyles}>{parseDateAndTime(routine.created)}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Last updated: </span>
						<span class={spanStyles}>{parseDateAndTime(routine.updated)}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="{colStyles} lg:col-span-2">
			<div class={divideStyles}>
				<h4 class="mb-2 h4">Requestee Information</h4>

				<div class="flex flex-col pt-4 gap-y-2">
					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Name: </span>
						<span class={spanStyles}>{routine.expand?.requestee?.name ?? 'N/A'}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Email: </span>
						<span class={spanStyles}>{routine.expand?.requestee?.email ?? 'N/A'}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Job Description: </span>
						<span class={spanStyles}>{routine.expand?.requestee?.jobDescription ?? 'N/A'}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="{colStyles} lg:col-span-2">
			<div class={divideStyles}>
				{#if (attachment.type !== 'image/jpg') & (attachment.type !== 'image/png') & (attachment.type !== 'image/jpeg')}
					<h4 class="mb-2 h4">Uploaded documents</h4>

					<div class="flex flex-col pt-4 gap-y-2">
						<span> Attachment: </span>

						<div class="flex flex-col items-center justify-between xl:flex-row">
							<div class="flex items-center gap-2">
								<a href={attachmentUrl + '&download=1'} download>
									<IconDownload size={30} />
								</a>

								{#if attachment.type === 'application/pdf'}
									<button
										type="button"
										on:click={() => onClickViewFile(attachmentUrl)}
										class="cursor-pointer"
									>
										<IconMaximize size={30} />
									</button>
								{/if}
							</div>

							<span class={spanStyles}>{attachment.name}</span>
						</div>
					</div>
				{:else}
					<div class="flex items-center justify-between gap-4 mb-2">
						<h4 class="h4">Attachment</h4>

						<div class="flex gap-2">
							<a href={attachmentUrl + '&download=1'} download>
								<IconDownload size={30} />
							</a>

							<button
								type="button"
								on:click={() => onClickView(attachmentUrl)}
								class="cursor-pointer"
							>
								<IconMaximize size={30} />
							</button>
						</div>
					</div>

					<div class="pt-4">
						<img
							use:lazyLoad={attachmentUrl}
							class="transition duration-500 opacity-0 w-full object-contain h-[20rem]"
							alt="_"
						/>
					</div>
				{/if}
			</div>
		</div>

		<div class="{colStyles} lg:col-span-2 {isOfTypeDoc ? 'lg:row-span-2' : ''}">
			<div class={divideStyles}>
				<h4 class="mb-2 h4">
					{routine.expand?.maintenanceTeamId?.name ?? 'N/A'} - {members.length} records found
				</h4>

				<table class="w-full text-sm text-left">
					<thead class="uppercase bg-gray-100 dark:bg-neutral-800">
						<tr>
							<th scope="col" class={tableHeaderStyles}> Name </th>
							<th scope="col" class={tableHeaderStyles}> Job Description </th>
							<th scope="col" class={tableHeaderStyles}> Status </th>
						</tr>
					</thead>
					<tbody>
						{#if members.length === 0}
							<h4 class="h4 self-center p-2">No members for this team</h4>
						{:else}
							{#each members as member}
								<tr
									class="transition-colors bg-white border-b rounded dark:bg-neutral-900 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900"
								>
									<td class={tdStyles}> {member.name} </td>
									<td class={tdStyles}> {member.jobDescription} </td>
									<td
										class="{tdStyles} {member.isLead
											? ' text-primary-600 dark:text-tertiary-500 font-semibold uppercase'
											: ''}"
									>
										{member.isLead ? 'Lead' : ''}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<script>
	import { onDestroy, onMount } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import { lazyLoad } from '$lib/actions/lazyLoad.js';
	import { parseDateAndTime } from '$lib/utils/parsers/parseDateAndTime';
	import { IconArrowNarrowLeft, IconDownload, IconMaximize, IconEdit } from '@tabler/icons-svelte';
	import { expand, updateRequest } from '$lib/api/changeRequests';
	import { currentUser } from '$lib/stores/auth';

	export let data;

	$: ({ request, attachmentUrl, closingAttachmentUrl, attachment, closingAttachment, members } =
		data);
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

	function editApplication(request) {
		modalStore.trigger({
			type: 'component',
			component: 'editChangeRequest',
			backdropClasses: '!bg-black/50',
			meta: { request, attachment }
		});
	}

	function closeRequest(request) {
		modalStore.trigger({
			type: 'component',
			component: 'closeRequest',
			backdropClasses: '!bg-black/50',
			meta: { request, attachment }
		});
	}

	async function reopenRequest() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Are you sure you wish to re-open this request?',
			body: 'Are you sure you wish to proceed?',
			modalClasses: '!bg-white dark:!bg-neutral-800 !rounded-none',
			response: async (r) => {
				if (r) {
					request = await updateRequest(request.id, {
						isClosed: false,
						submissionWithinFiveDays: null,
						durationAdhered: null,
						serviceImpactCorrect: null,
						correctCustomerList: null,
						taskCompletion: null,
						closingRemarks: null,
						closingAttachment: null
					});
				}
			}
		});
	}

	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('changerequests').subscribe(
			request.id,
			async (e) => {
				toastStore.clear();
				toastStore.trigger({
					message: `A request has been ${e.action}d!`,
					timeout: 3000
				});

				request = e.record;
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
		<a href="/change-requests" class="-ml-2">
			<IconArrowNarrowLeft size={40} />
		</a>

		<div class="flex items-center gap-2">
			{#if !request.isClosed}
				<button
					type="button"
					on:click={() => editApplication(request)}
					class=" border border-black/30 dark:border-white/30 flex py-2.5 px-8 gap-x-1 items-center justify-center rounded uppercase font-semibold bg-white dark:bg-neutral-900"
				>
					<span>
						<IconEdit />
					</span>
					<span>Edit Request</span>
				</button>
			{/if}

			{#if !request.isClosed}
				<button
					type="button"
					on:click={() => closeRequest(request)}
					class="btn variant-ghost-error text-white-900 rounded uppercase font-semibold py-2.5 px-8"
				>
					Close Request
				</button>
			{:else if $currentUser.role === 'admin'}
				<button
					type="button"
					on:click={() => reopenRequest()}
					class="btn variant-ghost-success text-white-900 rounded uppercase font-semibold py-2.5 px-8"
				>
					Re-Open Request
				</button>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 gap-1 pl-4 mt-4 lg:grid-cols-4 auto-rows-auto">
		<div class={colStyles + ' lg:col-span-2 lg:row-span-2'}>
			<div class={divideStyles}>
				<h4 class="mb-2 h4">Change Request Information</h4>

				<div class="flex flex-col gap-2 pt-4">
					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Status: </span>

						<span
							class="{request.isClosed ? 'text-error-500' : 'text-success-500'} font-bold uppercase"
						>
							{request.isClosed ? 'Closed' : 'Open'}
						</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Ticket #: </span>
						<span class={spanStyles}>{request.ticketNumber}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Title: </span>
						<span class={spanStyles}>{request.title}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Objective: </span>
						<span class={spanStyles}>{request.objective}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Service Impact: </span>
						<span class={spanStyles}>{request.serviceImpact}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Task Site: </span>
						<span class={spanStyles}>{request.expand?.siteId?.name ?? 'N/A'}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Involved System: </span>
						<span class={spanStyles}>{request.involvedSystem}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 my-4">
						<span> Technical Group(s) Involved: </span>

						<ol class="list {spanStyles}">
							{#each request.expand?.teamIds as { name }, idx}
								<li>
									<span>{idx + 1}.</span>
									<span class="flex-auto">{name}</span>
								</li>
							{/each}
						</ol>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Change Team: </span>
						<span class={spanStyles}>{request.expand?.changeTeamId?.name ?? 'N/A'}</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Brief Summary of CR: </span>
						<span class={spanStyles}>
							{request.summary}
						</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 my-4">
						<span> List of Services: </span>

						<ol class="list {spanStyles}">
							{#each request.expand?.servicesListIds as { name }, idx}
								<li>
									<span>{idx + 1}.</span>
									<span class="flex-auto">{name}</span>
								</li>
							{/each}
						</ol>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
						<span> Awareness To Be Made: </span>
						<span class={spanStyles}>
							{request.awarenessToBeMade}
						</span>
					</div>
				</div>
			</div>
		</div>

		<div class="{colStyles} lg:col-span-2">
			<div class={divideStyles}>
				<h4 class="mb-2 h4">Date Information</h4>

				<div class="flex flex-col pt-4 gap-y-2">
					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Start Date: </span>
						<span class={spanStyles}>{parseDateAndTime(request.startDate)}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> End Date: </span>
						<span class={spanStyles}>{parseDateAndTime(request.endDate)}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Created At: </span>
						<span class={spanStyles}>{parseDateAndTime(request.created)}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Last updated: </span>
						<span class={spanStyles}>{parseDateAndTime(request.updated)}</span>
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
						<span class={spanStyles}>{request.expand?.requestee?.name ?? 'N/A'}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Email: </span>
						<span class={spanStyles}>{request.expand?.requestee?.email ?? 'N/A'}</span>
					</div>

					<div class="grid grid-cols-1 xl:grid-cols-2 auto-rows-auto">
						<span> Job Description: </span>
						<span class={spanStyles}>{request.expand?.requestee?.jobDescription ?? 'N/A'}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="{colStyles} lg:col-span-2">
			<div class={divideStyles}>
				{#if (attachment.type !== 'image/jpg') & (attachment.type !== 'image/png') & (attachment.type !== 'image/jpeg')}
					<h4 class="mb-2 h4">Uploaded document</h4>

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
						<span> Attachment: </span>

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
					{request.expand?.changeTeamId?.name ?? 'N/A'} - {members.length} records found
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

		{#if request.isClosed}
			<div class={colStyles + ' lg:col-span-2 lg:row-span-2'}>
				<div class={divideStyles}>
					<h4 class="mb-2 h4">Closure Summary</h4>

					<div class="flex flex-col gap-2 pt-4">
						<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
							<span> CR Submission within 5 Days: </span>
							<span class={spanStyles}>
								{request.submissionWithinFiveDays}
							</span>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
							<span> Duration of the CR is adhered to: </span>
							<span class={spanStyles}>
								{request.durationAdhered}
							</span>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
							<span> Service Impact is Correct: </span>
							<span class={spanStyles}>
								{request.serviceImpactCorrect}
							</span>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
							<span> Correct list of Customers Submitted: </span>
							<span class={spanStyles}>
								{request.correctCustomerList}
							</span>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
							<span> Completion of Task: </span>
							<span class={spanStyles}>
								{request.taskCompletion}
							</span>
						</div>

						{#if request.closingRemarks.length > 0}
							<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
								<span> Closing Remarks: </span>
								<span class={spanStyles}>
									{request.closingRemarks ?? 'N/A'}
								</span>
							</div>
						{/if}

						{#if request.isClosed && request.closingAttachment.length > 0}
							<div class={divideStyles}>
								{#if (closingAttachment.type !== 'image/jpg') & (closingAttachment.type !== 'image/png') & (closingAttachment.type !== 'image/jpeg')}
									<div class="flex flex-col pt-4 gap-y-2">
										<span> Attachment: </span>

										<div class="flex flex-col items-center justify-between xl:flex-row">
											<div class="flex items-center gap-2">
												<a href={closingAttachmentUrl + '&download=1'} download>
													<IconDownload size={30} />
												</a>

												{#if closingAttachment.type === 'application/pdf'}
													<button
														type="button"
														on:click={() => onClickViewFile(closingAttachmentUrl)}
														class="cursor-pointer"
													>
														<IconMaximize size={30} />
													</button>
												{/if}
											</div>

											<span class={spanStyles}>{closingAttachment.name}</span>
										</div>
									</div>
								{:else}
									<div class="flex items-center justify-between gap-4 mb-2 pt-4">
										<span> Attachment: </span>

										<div class="flex gap-2">
											<a href={closingAttachmentUrl + '&download=1'} download>
												<IconDownload size={30} />
											</a>

											<button
												type="button"
												on:click={() => onClickView(closingAttachmentUrl)}
												class="cursor-pointer"
											>
												<IconMaximize size={30} />
											</button>
										</div>
									</div>

									<div class="pt-4">
										<img
											use:lazyLoad={closingAttachmentUrl}
											class="transition duration-500 opacity-0 w-full object-contain h-[20rem]"
											alt="_"
										/>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

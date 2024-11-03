<script>
	export let ticket;
</script>

<table class="table table-hover w-full">
	<tbody>
		<tr>
			<td>Department(s) Concerned</td>
			<td>
				<ol class="list text-primary-600 dark:text-tertiary-500">
					{#each ticket.expand?.departmentIds as { name }, idx}
						<li>
							<span>{idx + 1}.</span>
							<span class="flex-auto">{name}</span>
						</li>
					{/each}
				</ol>
			</td>
		</tr>

		<tr>
			<td>Department Equipment(s)</td>
			<td>
				{#each ticket.expand?.departmentEquipmentIds as { name }, idx}
					<ol class="list text-primary-600 dark:text-tertiary-500">
						<li>
							<span>{idx + 1}.</span>
							<span class="flex-auto">{name}</span>
						</li>
					</ol>
				{/each}
			</td>
		</tr>

		<tr>
			<td>Team(s) involved</td>
			<td>
				<ol class="list text-primary-600 dark:text-tertiary-500">
					{#each ticket.expand?.teamIds as { name }, idx}
						<li>
							<span>{idx + 1}.</span>
							<span class="flex-auto">{name}</span>
						</li>
					{/each}
				</ol>
			</td>
		</tr>
	</tbody>
</table>

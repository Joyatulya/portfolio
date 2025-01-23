<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { dataSets } from '../mockDB';
	import Button from '$lib/components/ui/button/button.svelte';
	import { parse_bm } from '../insulinAnalysis';

	let bm_data = getContext('bm_data');

	function handleSelect(data): void {
		label = data.label;
		bm_data.value = parse_bm(data.dataSet);
	}
	import * as Select from '$lib/components/ui/select/index.js';

	let label = $state('Select Dataset');
</script>

<div class="mt-8">
	<Select.Root onValueChange={(v) => handleSelect(v)} type="single">
		<Select.Trigger class="w-full text-lg">
			{label}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each Object.entries(dataSets) as [label, dataSet]}
					<Select.Item value={{ label, dataSet }} {label} />
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>

<script lang="ts">
	import { getContext } from 'svelte';
	import { InsulinAnalysis, type IPATIENT, type TTopAggregation } from '../insulinAnalysis';

	let bm_data = getContext('bm_data');
	// const user = getContext<IPATIENT>('user');
	let averages: TTopAggregation = $derived(InsulinAnalysis.calculate_averages(bm_data.value));
</script>

<div class="space-y-2 divide-y-2">
	{averages.all.all.mean}
</div>

{#snippet basic_data(label: string, data: string | number)}
	<div>
		<p class="text-xl">{label}</p>
		<p class="text-3xl font-semibold">{data}</p>
	</div>
{/snippet}

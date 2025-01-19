<!-- 
	- Add a toast for the first time users informing them that think of this as a
small consultation, the information we are gathering is for your own well being
so that we can make more informed decisions for you. 

-->
<script lang="ts">
	import { mountEchart } from '$lib/utils/chartUtils.svelte.ts';
	import type { EChartsOption } from 'echarts';
	import {
		Basal_Bolus_T2DM,
		convert_mean_bm_to_hba1c,
		insulin_analysis,
		INSULIN_REGIMENS,
		nph_od_t2dm
	} from './insulinAnalysis';
	import ReadingEntry from './components/ReadingEntry.svelte';
	import { movingAverage } from '$lib/utils/dataUtils';
	import { dummyBM } from './mockDB';

	let length = $state(dummyBM.length);
	let data = $derived(dummyBM.slice(0, length));
	let option: EChartsOption = $derived.by(() => {
		console.log('updates', length);
		let option = {
			xAxis: {
				type: 'category',
				data: data.map((x) => new Date(x.date).getDate())
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					data: movingAverage(
						data.slice(0, length).map((x) => x.value),
						3
					),
					type: 'line',
					smooth: true
				},
				{
					data: data.slice(0, length).map((x) => x.value),
					type: 'line',
					smooth: true
				}
			]
		};
		return { ...option };
	});
	const analysis = insulin_analysis.calculate_averages(dummyBM, 7);
	const hypos = insulin_analysis.filter_hypos(dummyBM);
	const basal_bolus = new Basal_Bolus_T2DM({ breakfast: 3, basal: 10 }).recommendation(dummyBM);
	const estimated_hba1c = convert_mean_bm_to_hba1c(analysis.all.mean_bm) + '%';
</script>

<main class="relative p-4">
	<ReadingEntry />
	<div class="space-y-2 divide-y-2 py-3">
		<div class="flex py-2 *:flex-1">
			{@render basic_data('Your Sugar Control', 'Improving')}
		</div>
		<div class="flex py-2 *:flex-1">
			{@render basic_data('Estimated Hba1c', estimated_hba1c)}
		</div>
		<div class="flex py-2 *:flex-1">
			{@render basic_data('Insulin', '10 units')}
			{@render basic_data('Last Change', '4 days ago')}
		</div>
		<div class="flex py-2 *:flex-1">
			{@render basic_data('Average Sugar', analysis.all.mean_bm + ' mg/dl')}
			{@render basic_data('Average Sugar since Insulin Change', '110 mg/dl')}
		</div>
		<div class="flex py-2 *:flex-1">
			{@render basic_data('Hypos in 7 days', hypos.length)}
			{@render basic_data('Lowest Sugar', hypos[0].value + ' mg/dl')}
		</div>
		<div>
			{@render basic_data('Average Sugar', analysis.all.mean_bm)}
			<div class="flex flex-wrap py-2 *:min-w-[50%]">
				{@render basic_data('Fasting', analysis.fasting.mean_bm)}
				{@render basic_data('Pre-Lunch', analysis.pre_lunch.mean_bm)}
				{@render basic_data('Pre-Dinner', analysis.pre_dinner.mean_bm)}
				{@render basic_data('Night', analysis.night.mean_bm)}
			</div>
		</div>
	</div>
	<div class="h-96" use:mountEchart={option}></div>
</main>

{#snippet basic_data(label: string, data: string | number)}
	<div>
		<p class="text-xl">{label}</p>
		<p class="text-3xl font-semibold">{data}</p>
	</div>
{/snippet}

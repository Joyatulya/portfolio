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
		type IPATIENT
	} from './insulinAnalysis';
	import ReadingEntry from './components/ReadingEntry.svelte';
	import { movingAverage } from '$lib/utils/dataUtils';
	import { Settings } from 'lucide-svelte';
	import InsulinInformation from './components/InsulinInformation.svelte';
	import { getContext } from 'svelte';
	import InsulinRecommendation from './InsulinRecommendation.svelte';

	let { data } = $props();
	let { data: bm_data } = data;

	const user: IPATIENT = getContext('user');
	const analyser = user.insulin_analyser;

	let option: EChartsOption = $derived.by(() => {
		let option = {
			xAxis: {
				type: 'category',
				data: data.data.map((x) => new Date(x.date).getDate())
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					data: movingAverage(
						data.data.map((x) => x.value),
						3
					),
					type: 'line',
					smooth: true
				},
				{
					data: data.data.map((x) => x.value),
					type: 'line',
					smooth: true
				}
			]
		};
		return { ...option };
	});

	const analysis = analyser.calculate_averages(bm_data, 5);
	const hypos = analyser.filter_hypos(bm_data);
	const estimated_hba1c = convert_mean_bm_to_hba1c(analysis.all.mean_bm) + '%';
	console.log(analyser.recommendation(bm_data));
</script>

<main class="relative p-4">
	<a href="/projects/insulin/settings"><Settings /></a>
	<div class="h-96" use:mountEchart={option}></div>
	<InsulinInformation />
	<InsulinRecommendation />
	<ReadingEntry />
	<div class="space-y-2 divide-y-2">
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
			<!-- {@render basic_data('Lowest Sugar', hypos?.[0].value + ' mg/dl')} -->
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
</main>

{#snippet basic_data(label: string, data: string | number)}
	<div>
		<p class="text-xl">{label}</p>
		<p class="text-3xl font-semibold">{data}</p>
	</div>
{/snippet}

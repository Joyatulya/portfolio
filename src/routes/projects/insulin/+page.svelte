<!-- 
	- Add a toast for the first time users informing them that think of this as a
small consultation, the information we are gathering is for your own well being
so that we can make more informed decisions for you. 

-->
<script lang="ts">
	import { mountEchart } from '$lib/utils/chartUtils.svelte.ts';
	import type { EChartsOption } from 'echarts';
	import { INSULIN_REGIMENS, nph_od_t2dm } from './insulinAnalysis';
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

	let analysis = nph_od_t2dm.insulin_adjustment(data);
</script>

<main class="p-4">
	<div class="h-96" use:mountEchart={option}></div>
	<ReadingEntry />
	<div>
		Last Insulin Change Number Hypos / number hypers Estimated Hba1c, previous hba1c Hba1c trends
		reactiveness of app post readings are added, positive or negative feedback given Patient area
		where I can teach them abuot the most common issues & Dangers
	</div>
</main>

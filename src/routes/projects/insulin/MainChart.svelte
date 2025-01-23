<script lang="ts">
	import { mountEchart } from '$lib/utils/chartUtils.svelte.ts';
	import type { EChartsOption } from 'echarts';
	import { movingAverage } from '$lib/utils/dataUtils';
	import type { PARSED_BM } from './insulinAnalysis';
	import { getContext } from 'svelte';

	let bm_data = getContext<{ value: PARSED_BM[] }>('bm_data');
	let option: EChartsOption = $derived.by(() => {
		let option = {
			xAxis: {
				type: 'category',
				data: bm_data.value.map((x) => x.date.getDate())
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: 'Average',
					data: movingAverage(
						bm_data.value.map((x) => x.value),
						3
					),
					type: 'line',
					smooth: true
				},
				{
					name: 'Sugar Levels',
					data: bm_data.value.map((x) => x.value),
					type: 'line',
					smooth: true,
					markArea: {
						silent: true,
						data: [
							[
								{
									// name: 'Hypoglycaemia',
									itemStyle: {
										color: 'rgba(55, 173, 77, 0.2)'
									},
									yAxis: 80
									// xAxis: '19',
									// coord: [19, 100]
								},
								{
									yAxis: 160
									// xAxis: '21',
									// coord: [21, 100]
								}
							]
						]
					}
				}
			]
		};
		return { ...option };
	});
</script>

<svelte:boundary>
	{#key bm_data.value}
		<div class="h-96" use:mountEchart={option}></div>
	{/key}
	{#snippet failed()}
		It Failed
	{/snippet}
</svelte:boundary>

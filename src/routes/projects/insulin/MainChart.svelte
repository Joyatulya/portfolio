<script lang="ts">
	import { mountEchart } from '$lib/utils/chartUtils.svelte.ts';
	import type { EChartsOption } from 'echarts';
	import { movingAverage } from '$lib/utils/dataUtils';
	import type { PARSED_BM } from './insulinAnalysis';

	let { data }: { data: PARSED_BM[] } = $props();

	let option: EChartsOption = $derived.by(() => {
		let option = {
			xAxis: {
				type: 'category',
				data: data.map((x) => x.date.getDate())
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: 'Average',
					data: movingAverage(
						data.map((x) => x.value),
						3
					),
					type: 'line',
					smooth: true
				},
				{
					name: 'Sugar Levels',
					data: data.map((x) => x.value),
					type: 'line',
					smooth: true,
					markArea: {
						silent: true,
						data: [
							[
								{
									// name: 'Hypoglycaemia',
									itemStyle: {
										color: 'rgba(255, 73, 77, 0.05)'
									},
									yAxis: 70
									// xAxis: '19',
									// coord: [19, 100]
								},
								{
									yAxis: 0
									// xAxis: '21',
									// coord: [21, 100]
								}
							],
							[
								{
									// name: 'Hyperglycaemia',
									yAxis: Infinity,
									itemStyle: {
										color: 'rgba(100, 73, 0, 0.1)'
									}
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

<div class="h-96" use:mountEchart={option}></div>

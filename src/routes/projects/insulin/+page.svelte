<script lang="ts">
	import { mountEchart } from '$lib/utils/chartUtils.svelte.ts';
	import type { EChartsOption } from 'echarts';
	import { dummyBM } from './insulinAnalysis';
	import Input from '$lib/components/ui/input/input.svelte';

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
					data: data.slice(0,length).map((x) => x.value),
					type: 'line',
					smooth: true
				}
			]
		};
		return {...option}
	});
	
</script>

<main class="p-4">
	<div class="h-96" use:mountEchart={option}></div>
	<Input type="range" bind:value={length} max={dummyBM.length} />
</main>

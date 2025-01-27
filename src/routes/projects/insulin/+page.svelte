<!-- 
	- Add a toast for the first time users informing them that think of this as a
small consultation, the information we are gathering is for your own well being
so that we can make more informed decisions for you. 

-->
<script lang="ts">
	import { Settings } from 'lucide-svelte';
	import { getContext, setContext } from 'svelte';
	import InsulinRecommendation from './InsulinRecommendation.svelte';
	import MainChart from './MainChart.svelte';
	import TrendsStatistics from './components/TrendsStatistics.svelte';
	import DataSelector from './components/DataSelector.svelte';
	import ReadingEntry from './components/ReadingEntry.svelte';
	import Gauge from './components/Gauge.svelte';

	let { data } = $props();
	let { data: bm_data } = data;
	let reactiveBMData = $state({ value: bm_data });
	setContext('bm_data', reactiveBMData);
</script>

<main class="relative p-4">
	<a href="/projects/insulin/settings"><Settings /></a>
	<DataSelector />
	<MainChart />
	<!-- <InsulinInformation /> -->
	<!-- <TrendsStatistics /> -->
	<InsulinRecommendation />
	<ReadingEntry />
</main>

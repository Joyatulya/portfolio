<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { SodiumAnalysis, NaSchema } from './SodiumAnalysis';

	const pt = $state({
		curr_na: undefined,
		target_na: 0,
		weight: undefined
	});

	let na_pt = $derived.by(() => {
		let parsed_pt;
		try {
			parsed_pt = NaSchema.parse(pt);
		} catch (error) {
			return null;
		}
		return new SodiumAnalysis(parsed_pt);
	});
</script>

<main>
	<Input type="number" bind:value={pt.curr_na} placeholder="Current Sodium" />
	<Input type="number" bind:value={pt.target_na} placeholder="Desired Sodium" />
	<Input type="number" bind:value={pt.weight} placeholder="Weight (in kg)" />
	<p>Results</p>
	{#if na_pt}
		{na_pt.weight}
		<!-- content here -->
	{:else}
		<!-- else content here -->
		Input Right Values
	{/if}
</main>

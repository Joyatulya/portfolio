<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { SodiumAnalysis, NaSchema, SexTypes, AgeGroupTypes } from './SodiumAnalysis';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	const pt = $state({
		curr_na: undefined,
		target_na: 140,
		weight: undefined,
		gender: SexTypes.MALE,
		age: undefined
	});

	let na_pt = $derived.by(() => {
		let parsed_pt = NaSchema.safeParse(pt);
		if (!parsed_pt.success) {
			return null;
		}
		return new SodiumAnalysis(parsed_pt.data);
	});
</script>

<main>
	<Input type="number" bind:value={pt.curr_na} placeholder="Current Sodium" />
	<Input type="number" bind:value={pt.target_na} placeholder="Desired Sodium" />
	<Input type="number" bind:value={pt.weight} placeholder="Weight (in kg)" />
	<Input type="number" bind:value={pt.age} placeholder="Age" />

	<RadioGroup.Root bind:value={pt.gender}>
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value={SexTypes.MALE} id="male" />
			<Label for="male">Male</Label>
		</div>
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value={SexTypes.FEMALE} id="female" />
			<Label for="female">Female</Label>
		</div>
	</RadioGroup.Root>

	<p>Results</p>
	{#if na_pt}
		{na_pt.weight}
		<!-- content here -->
	{:else}
		<!-- else content here -->
		Input Right Values
	{/if}
</main>

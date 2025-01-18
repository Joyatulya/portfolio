<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { SodiumAnalysis, NaSchema, SexTypes, AgeGroupTypes, fluids } from './SodiumAnalysis';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	const pt = $state({
		curr_na: 167,
		target_na: 140,
		fluid_na: 131,
		weight: 70,
		sex: SexTypes.MALE,
		age: 70,
		losses: undefined,
		na_correction_rate: 5
	});

	let na_pt = $derived.by(() => {
		let parsed_pt = NaSchema.safeParse(pt);
		if (!parsed_pt.success) {
			console.error(parsed_pt.error.format())
			return null;
		}
		const fresh_pt = new SodiumAnalysis(parsed_pt.data);
		return fresh_pt.get_analysis();
	});

	$inspect(na_pt);
</script>

<main class="p-4">
	<Input type="number" bind:value={pt.curr_na} placeholder="Current Sodium" />
	<Input type="number" bind:value={pt.target_na} placeholder="Desired Sodium" />
	<Input type="number" bind:value={pt.weight} placeholder="Weight (in kg)" />
	<Input type="number" bind:value={pt.age} placeholder="Age" />
	<Input type="number" bind:value={pt.losses} placeholder="Daily Fluid Losses" />
	<Input type="number" bind:value={pt.na_correction_rate} placeholder="Sodium Correction Rate" />

	<RadioGroup.Root bind:value={pt.sex}>
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value={SexTypes.MALE} id="male" />
			<Label for="male">Male</Label>
		</div>
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value={SexTypes.FEMALE} id="female" />
			<Label for="female">Female</Label>
		</div>
	</RadioGroup.Root>

	<Select.Root type="single" bind:value={pt.fluid_na}>
		<Select.Trigger class="w-[180px]">Select Fluid</Select.Trigger>
		<Select.Content>
			{#each fluids as fluid}
				<Select.Item value={fluid.na}>{fluid.name}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<p>Results</p>
	{#if na_pt}
		<div>
			<div>
				<p>Correction Rate</p>
				<p>{na_pt.fluid_rate_hr} ml/hr</p>
			</div>
			<div>
				<p>Estimated Net Water Deficit</p>
				<p>{na_pt.water_deficit} litres</p>
			</div>
			<div>
				<p>Estimated Treatment Duration</p>
				<p>{na_pt.treatment_duration} hr</p>
			</div>
			<div>
				<p>Estimated Total Fluid Infusion Volume</p>
				<p>{na_pt.total_fluid_infusion_volume} L</p>
			</div>
		</div>
	{:else}
		<!-- else content here -->
		Input Right Values
	{/if}
</main>

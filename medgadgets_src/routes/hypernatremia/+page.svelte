<script lang="ts">
	import AgeGroupSelect from '$lib/components/form/AgeGroupSelect.svelte';
	import GenderSelect from '$lib/components/form/GenderSelect.svelte';
	import SetTitle from '$lib/utils/setTitle.svelte';
	import WeightInput from '$lib/components/form/input/WeightInput.svelte';
	import HeightInput from '$lib/components/form/input/HeightInput.svelte';
	import SodiumInput from '$lib/components/form/input/SodiumInput.svelte';
	import TargetSodiumInput from '$lib/components/form/input/TargetSodiumInput.svelte';
	import DataAnalysis from './DataAnalysis.svelte';
	import { AgeGroupTypes, SexTypes, type ISodiumPatient } from './types';
	import CorrectionRate from '$lib/components/form/input/CorrectionRate.svelte';
	import CorrectionFluids from '$lib/components/form/CorrectionFluids.svelte';
	import UrinaryLosses from '$lib/components/form/input/UrinaryLosses.svelte';
	import OtherLosses from '$lib/components/form/input/OtherLosses.svelte';
	import InsensibleLosses from '$lib/components/form/input/InsensibleLosses.svelte';
	/** @type {import('./$types').PageData} */
	export let data;

	let patient: ISodiumPatient = {
		age: AgeGroupTypes.ADULT,
		sex: SexTypes.MALE,
		weight: null,
		height: null,
		curr_sodium: null,
		target_sodium: null,
		correction_rate: null,
		correction_fluid_na: null,
		urinary_losses: 0,
		insensible_losses: 0,
		other_losses: 0
	};
</script>

<SetTitle pageTitle={'Hypernatremia'} />

<section class="p-6 bg-base-300 text-sm">
	<form novalidate="" action="" class="container flex flex-col mx-auto space-y-12">
		<fieldset class="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm">
			<div class="space-y-2 col-span-full lg:col-span-1">
				<p class="font-medium text-lg">Demographic Details</p>
				<p class="text-sm">
					Provide the basic details which will be helpful in calculating the appropriate multiplying
					factor
				</p>
			</div>
			<div class="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
				<div class="col-span-full sm:col-span-3">
					<GenderSelect bind:sex={patient.sex} />
				</div>
				<div class="col-span-full sm:col-span-3">
					<AgeGroupSelect bind:age_group={patient.age} />
				</div>
				<div class="col-span-full sm:col-span-3">
					<WeightInput bind:converted_value={patient.weight} />
				</div>
				<div class="col-span-full sm:col-span-3">
					<HeightInput bind:converted_value={patient.height} />
				</div>
			</div>
		</fieldset>
		<div class="divider" />
		<fieldset class="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm">
			<div class="space-y-2 col-span-full lg:col-span-1">
				<p class="font-medium text-lg">Sodium & Management Details</p>
				<p class="text-sm">
					Provide current status of sodium and management goals (rate, target sodium).
				</p>
			</div>
			<div class="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
				<div class="col-span-full sm:col-span-3">
					<SodiumInput bind:converted_value={patient.curr_sodium} />
				</div>
				<div class="col-span-full sm:col-span-3">
					<TargetSodiumInput bind:converted_value={patient.target_sodium} />
				</div>
				<div class="col-span-full sm:col-span-3">
					<CorrectionRate bind:converted_value={patient.correction_rate} />
				</div>
				<div class="col-span-full">
					<CorrectionFluids
						targetSodium={patient.target_sodium}
						bind:correction_fluid_na={patient.correction_fluid_na}
					/>
				</div>
			</div>
		</fieldset>
		<fieldset class="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm">
			<div class="space-y-2 col-span-full lg:col-span-1">
				<p class="font-medium text-lg">Fluid Losses</p>
				<p class="text-sm">Estimate of the amount of fluid being lost everyday</p>
			</div>
			<div class="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
				<div class="col-span-full sm:col-span-3">
					<UrinaryLosses bind:converted_value={patient.urinary_losses} />
				</div>
				<div class="col-span-full sm:col-span-3">
					<OtherLosses bind:converted_value={patient.other_losses} />
				</div><div class="col-span-full sm:col-span-3">
					<InsensibleLosses bind:converted_value={patient.insensible_losses} />
				</div>
			</div>
		</fieldset>
	</form>
</section>
<div class="divider" />
<section id="analysis" class="container mx-auto my-4">
	<DataAnalysis {patient} />
</section>

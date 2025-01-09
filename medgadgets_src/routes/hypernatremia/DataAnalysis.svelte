<script lang="ts">
	import Icon from '$lib/icons/Icon.svelte';
	import { fade } from 'svelte/transition';
	import { SodiumAnalysis } from './SodiumAnalysis';
	import type { ISodiumPatient } from './types';
	import Modal from '$lib/components/Modal.svelte';

	export let patient: ISodiumPatient;
	let analysed_patient = new SodiumAnalysis(patient);
	let daily_fluid_infusion: number;
	let high_fluid_requirement: boolean;
	let treatment_duration: string;
	let treatment_start_end_time: string;
	$: {
		analysed_patient = new SodiumAnalysis(patient);
		daily_fluid_infusion = analysed_patient.litre_fluid_per_day(true);
		high_fluid_requirement = daily_fluid_infusion > 7;
		[treatment_duration, treatment_start_end_time] = analysed_patient.expected_treatment_duration();
	}
</script>

<div
	class="stats shadow gap-1 rounded-none grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
>
	<!-- Total Water Deficit -->
	<div class="stat">
		<div class="stat-figure text-secondary">
			<Icon name={'drop'} />
		</div>
		<div class="stat-title">Total Fluid Deficit</div>
		<div class="stat-value">{analysed_patient.water_deficit()} L</div>
		<!-- <div class="stat-desc">Jan 1st - Feb 1st</div> -->
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<Icon name="timer" />
		</div>
		<div class="stat-title">Expected Treatment Duration</div>
		<div class="stat-value">~ {treatment_duration}</div>
		<div class="stat-desc mt-2">{treatment_start_end_time}</div>
	</div>

	{#if high_fluid_requirement}
		<Modal animate>
			<div slot="clickable-element" class={`stat bg-error text-error-content`}>
				<div class="stat-figure text-secondary">
					<Icon name="syringe" />
				</div>
				<div class="stat-title text-inherit">Daily Fluid Requirement</div>
				<div class="stat-value">{daily_fluid_infusion} L/day</div>
				<div class="stat-desc text-error-content">Consider alternative correction fluid</div>
			</div>
			<span slot="heading">Inappropriate Fluid Requirement</span>
			<span slot="content"
				>This is likely due high sodium content of the <strong>correction fluid</strong> being used.
				Consider correction fluid with low Na<sup>+</sup> content.</span
			>
		</Modal>
	{:else}
		<div class={`stat`}>
			<div class="stat-figure text-secondary">
				<Icon name="syringe" />
			</div>
			<div class="stat-title text-inherit">Daily Fluid Requirement</div>
			<div class="stat-value">{daily_fluid_infusion} L/day</div>
		</div>
	{/if}


	<!-- -----------------------INFUSION BLOCK ---------------------------------------------------------- -->
	{#if high_fluid_requirement}
		<Modal animate>
			<div
				slot="clickable-element"
				class="stat bg-error text-error-content"
			>
				<div class="stat-figure text-secondary">
					<Icon name={'rate'} />
				</div>
				<div class="stat-title text-inherit">Infusion Rate</div>
				<div class="stat-value text-inherit">{analysed_patient.infusion_rate()} ml/hr</div>
				<div in:fade class="stat-desc text-inherit">
					Consider alternative correction fluid
				</div>
			</div>
			<span slot="heading">Inappropriate Fluid Requirement</span>
			<span slot="content"
				>This is likely due high sodium content of the <strong>correction fluid</strong> being used.
				Consider correction fluid with low Na<sup>+</sup> content.</span
			>
		</Modal>
	{:else}
		<div class="stat transition-colors">
			<div class="stat-figure text-secondary">
				<Icon name={'rate'} />
			</div>
			<div class="stat-title">Infusion Rate</div>
			<div class="stat-value">{analysed_patient.infusion_rate()} ml/hr</div>
		</div>
	{/if}
</div>

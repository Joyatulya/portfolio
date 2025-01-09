<script lang="ts">
	import { fade } from 'svelte/transition';
	import { capitaliseFirstLetter } from '$lib/utils/textUtils';
	import type { Unit } from './conversion_data';

	export let conversion_data: Unit[];
	export let min;
	export let max = 10_000;
	export let converted_value: number | null;
	
	let value: number | null = converted_value ? converted_value : null;
	let converted_min = min;
	let converted_max = max;

	let unit_num = 0;
	let curr_unit: Unit = conversion_data[unit_num];
	let metric = curr_unit.label;
	let input_error : boolean = false;

	$: {
		curr_unit = conversion_data[unit_num];
		converted_value = value !== null ? value * curr_unit.conversion_factor : null;
		input_error = converted_value !== null ? max < converted_value || min >= converted_value : false;
		converted_min = parseFloat((min / curr_unit.conversion_factor).toPrecision(3));
		converted_max = parseFloat((max / curr_unit.conversion_factor).toPrecision(3));
		converted_value = input_error ? null : converted_value
		// console.log(converted_value);
	}

	let placeholder = curr_unit.range ? `Range  ${curr_unit.range.low}-${curr_unit.range.high} ` : null

	function toggleUnits() {
		const conversion_data_length = conversion_data.length;
		unit_num = (unit_num + 1) % conversion_data_length;
	}

</script>

<div class="form-control w-full max-w-xs">
	<label class="label">
		<span class="">
			{capitaliseFirstLetter(curr_unit.label)} (in {curr_unit.unit})
		</span>
		<!-- <span class="label-text-alt">Top Right label</span> -->
	</label>
	<div class="flex join">
		<input
			type="number"
			name={metric}
			id={metric}
			bind:value
			{placeholder}
			class="input input-bordered join-item w-full"
			class:input-error={input_error}
			min={min ? min : 0}
			max={max}
		/>
		<button
			on:click={toggleUnits}
			type="button"
			class="btn btn-primary join-item"
			class:btn-disabled={conversion_data.length < 2}
			class:btn-error={input_error}
>
			{curr_unit.unit}
		</button>
	</div>

	<!-- Error message here -->
	<label class="label md:h-5">
	{#if input_error}
			<span transition:fade class="label-text-alt text-error">
				{capitaliseFirstLetter(curr_unit.label)} must be between {converted_min}
				and {converted_max}
				{curr_unit.unit}
			</span>
			{/if}
		</label>

	<!-- <span class="label-text-alt">Bottom Right label</span> -->
</div>

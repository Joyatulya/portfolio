<script lang="ts">
	import { AgeGroupTypes } from '../../../routes/hypernatremia/types';

	export let age_group: AgeGroupTypes;
</script>

<label for="age_group">Age</label>
<div class="w-full flex justify-around">
	<input
		class="btn"
		bind:group={age_group}
		type="radio"
		name="age_group"
		value={AgeGroupTypes.CHILD}
		aria-label="<10 yrs"
	/>
	<input
		class=" btn"
		bind:group={age_group}
		type="radio"
		name="age_group"
		value={AgeGroupTypes.ADULT}
		aria-label="10-65 yrs"
		checked
	/>
	<input
		class="btn"
		bind:group={age_group}
		type="radio"
		name="age_group"
		aria-label=">65 yrs"
		value={AgeGroupTypes.ELDERLY}
	/>
</div>

<style>
	input:checked {
		background: transparent;
	}
</style>

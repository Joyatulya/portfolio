<script>
	export let sex = 'M';
</script>

<label for="isMale">Gender</label>
<div class="flex justify-evenly">
	<input
		class="btn"
		bind:group={sex}
		type="radio"
		name="sex"
		value={'M'}
		aria-label="Male"
		checked
	/>
	<input
		class=" btn"
		bind:group={sex}
		type="radio"
		name="sex"
		value={'F'}
		aria-label="Female"
	/>
</div>

<style>
	input:checked {
		background: transparent;
	}
</style>

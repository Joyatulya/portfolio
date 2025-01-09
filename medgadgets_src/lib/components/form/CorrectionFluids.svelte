<script lang="ts">
	interface Fluid {
		name: string;
		na: number;
	}

	const fluids: Fluid[] = [
		{
			name: '0.9% Saline',
			na: 154
		},
		{
			name: '0.45% Saline',
			na: 77
		},
		{
			name: "Hartmann's",
			na: 131
		},
		{
			name: "Lactated Ringer's",
			na: 130
		},
		{
			name: 'Enteral Water',
			na: 0
		},
		{
			name: '5% Dextrose',
			na: 0
		},
		{
			name: 'D5-2NS',
			na: 34
		}
	];

	export let targetSodium: number;
	export let correction_fluid_na: number;

	$: fluid_list = fluids.filter((x) => x.na < targetSodium).sort((x, y) => x.na - y.na);
</script>

<label for="correction_fluid">Correction Fluid</label>
<div class="w-full grid sm:grid-cols-2 sm:gap-2 mt-2">
	{#each fluid_list as { name, na } (name)}
		<input
			class="btn"
			bind:group={correction_fluid_na}
			type="radio"
			name="correction_fluid"
			aria-label={`${name} (Na - ${na})`}
			value={na}
			style="text-transform: none;"
		/>
	{/each}
</div>

<style>
	input:checked {
		background: transparent;
	}
</style>

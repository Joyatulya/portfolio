<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { getContext } from 'svelte';
	let user = getContext('user')
</script>

<main>
	settings Age Weight gender insulin regimen current insulin dose insulin over the past few days
	insulin correction factor, if applicable, metric/imperial

	<div class="">
		<Label for="bm" class="text-right">Age</Label>
		<Input id="bm" value={user.age} placeholder="" class="col-span-3" />
	</div>
	<div class="">
		<Label for="bm" class="text-right">Weight</Label>
		<Input id="bm" value={user.weight} placeholder="" class="col-span-3" />
	</div>
	<div class="">
		<Label for="bm" class="text-right">HbA1c</Label>
		<Input id="bm" value={user.hba1c} placeholder="" class="col-span-3" />
	</div>
	<div class="">
		<Label for="bm" class="text-right">Gender</Label>
		<Input id="bm" value={user.is_male ? 'Male' : 'Female'} placeholder="" class="col-span-3" />
	</div>
	<div class="">
		<Label for="bm" class="text-right">Insulin Regimen</Label>
		<Input id="bm" placeholder="" class="col-span-3" />
	</div>
	<div class="">
		<Label for="bm" class="text-right">Current Insulin Dose</Label>
		<Input id="bm" placeholder="" class="col-span-3" />
	</div>
	<div class="">
		<Label for="bm" class="text-right">Insulin Correction Factor</Label>
		<Input id="bm" placeholder="" class="col-span-3" />
	</div>
	<div class="">
		<Label for="bm" class="text-right">Units</Label>
		<Input id="bm" placeholder="" class="col-span-3" />
	</div>
</main>

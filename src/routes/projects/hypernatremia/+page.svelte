<script lang="ts">
	import { Input } from "$lib/components/ui/input";

	const pt = $state({
		curr_na : undefined,
		target_na : 140
	})
</script>

<main>
	<Input type='number' bind:value={pt.curr_na} placeholder='Current Sodium' />
	<Input type='number' bind:value={pt.target_na} placeholder='Desired Sodium' />
	<p>Results</p>
	<p>
		Deficit
		{pt.curr_na - pt.target_na}
	</p>
</main>

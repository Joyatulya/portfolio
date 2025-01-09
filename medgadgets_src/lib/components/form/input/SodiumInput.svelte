<script>
	import BaseInput from './BaseEnahncedInput.svelte';
	import { SodiumUnits } from './conversion_data';
	const SODIUM_MAX = 200;
	const SODIUM_MIN = 90;
	export let converted_value
</script>

<BaseInput bind:converted_value conversion_data={SodiumUnits} max={SODIUM_MAX} min={SODIUM_MIN} />

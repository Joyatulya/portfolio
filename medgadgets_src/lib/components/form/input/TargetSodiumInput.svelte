
<script>
	import BaseInput from './BaseEnahncedInput.svelte';
	import { TargetSodiumUnits } from './conversion_data';
	const SODIUM_MAX = 200;
	const SODIUM_MIN = 90;
  export let converted_value = 140;
</script>

<BaseInput bind:converted_value conversion_data={TargetSodiumUnits} max={SODIUM_MAX} min={SODIUM_MIN} />
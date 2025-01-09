<script>
	import BaseInput from './BaseEnahncedInput.svelte';
	import { CorrectionRate } from './conversion_data';
	const CORRECTION_RATE_MAX = 20;
	const CORRECTION_RATE_MIN = 0;
  export let converted_value;
</script>

<BaseInput bind:converted_value conversion_data={CorrectionRate} max={CORRECTION_RATE_MAX} min={CORRECTION_RATE_MIN} />

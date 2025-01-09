<script lang="ts">
	import BaseInput from "./BaseEnahncedInput.svelte";
	import { WeightUnits } from "./conversion_data";
  const MAX_WEIGHT = 300
  const MIN_WEIGHT = 0
  export let converted_value : number;

</script>
<BaseInput max={MAX_WEIGHT} min={MIN_WEIGHT} conversion_data={WeightUnits} bind:converted_value/>
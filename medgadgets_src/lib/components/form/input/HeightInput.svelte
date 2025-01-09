<script>
	import BaseInput from "./BaseEnahncedInput.svelte";
	import { HeightUnits } from "./conversion_data";
  const MAX_HEIGHT = 250
  const MIN_HEIGHT = 30
  export let converted_value;

</script>
<BaseInput max={MAX_HEIGHT} min={MIN_HEIGHT} bind:converted_value conversion_data={HeightUnits}/>
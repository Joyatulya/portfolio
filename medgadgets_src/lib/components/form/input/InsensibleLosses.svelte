
<script lang="ts">
	import BaseInput from "./BaseEnahncedInput.svelte";
	import { InsensibleLosses } from "./conversion_data";
  export let converted_value : number;

</script>
<BaseInput conversion_data={InsensibleLosses} bind:converted_value/>
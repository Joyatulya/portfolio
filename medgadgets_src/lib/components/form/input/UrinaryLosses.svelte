<script lang="ts">
	import BaseInput from "./BaseEnahncedInput.svelte";
	import { UrniaryLosses } from "./conversion_data";
  export let converted_value : number;

</script>
<BaseInput conversion_data={UrniaryLosses} bind:converted_value/>
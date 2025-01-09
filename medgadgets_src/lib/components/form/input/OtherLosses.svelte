
<script lang="ts">
	import BaseInput from "./BaseEnahncedInput.svelte";
	import { OtherLosses } from "./conversion_data";
  export let converted_value : number;

</script>
<BaseInput conversion_data={OtherLosses} bind:converted_value/>
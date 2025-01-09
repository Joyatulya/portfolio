<script lang="ts">
  
  import type { PageData } from './$types';
  export let data : PageData

</script>

{#if data.patient}
   <!-- content here -->
   {#each data.patient as patient}
    <h2 class="text-xl">{patient.first_name}</h2> 
    <div class="divider">{patient.diseases}</div>
   {/each}
{/if}
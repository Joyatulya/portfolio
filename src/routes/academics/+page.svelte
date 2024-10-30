<script lang="ts">
	import { PUBLICATIONS } from '$lib/portfolio_data/academic';
	import AcademicCard from './AcademicCard.svelte';
</script>

<main class="p-4">
	<h1 class="h1 mb-8">Academics</h1>
	<div class="flex flex-wrap justify-center gap-4">
		{#each PUBLICATIONS as pub}
			<AcademicCard {pub} />
		{/each}
	</div>
</main>

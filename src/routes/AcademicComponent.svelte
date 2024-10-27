<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import IntersectionWrapper from '$lib/components/UI/IntersectionWrapper.svelte';
	import { PUBLICATIONS } from '$lib/portfolio_data/academic';
	import { join_to_string_if_array } from '$lib/utils/textUtils';
	const bg_images = ['/assets/bacteria.svg', '/assets/virus.svg', '/assets/blood.svg'];
</script>

<div id='medicine' class="grid grid-cols-1 gap-4 md:grid-cols-3">
	{#each PUBLICATIONS.slice(0, 3) as pub, i}
		<div
			id="card"
			class="group min-w-40 rounded-md border border-muted p-4"
			style="background-image: url({bg_images[i]});"
		>
			<div id="bg-image"></div>
			<a
				href={pub.link}
				target="_blank"
				rel="noreferrer"
				title={pub.name}
				class=" group-hover:underline"
			>
				{pub.name}
			</a>
			<p class="text-muted">
				{join_to_string_if_array(pub.type)}
			</p>
			{#if pub.doi}
				<a href={pub.doi} target="_blank" rel="noreferrer">DOI</a>
			{/if}
			{join_to_string_if_array(pub.published_place)}
		</div>
	{/each}
	<Button href="/academics" variant="ghost" class="mt-2 underline">Explore all projects ></Button>
</div>

<style>
	#card {
		background-size: 100px 500px;
		background-repeat: round;
		background-position: 0px 0px;
		animation: bgMove 30s linear infinite;
	}
	@keyframes bgMove {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 100% 100%;
		}
	}
</style>

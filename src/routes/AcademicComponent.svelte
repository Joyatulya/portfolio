<script lang="ts">
	import IntersectionWrapper from '$lib/components/UI/IntersectionWrapper.svelte';
	import { PUBLICATIONS } from '$lib/portfolio_data/academic';
	function join_to_string_if_array(input: string | string[]): string {
		return Array.isArray(input) ? input.join(', ') : input;
	}
	let intersecting = false;
</script>

<div class="flex flex-wrap gap-4">
	{#each PUBLICATIONS as pub}
		<IntersectionWrapper bind:intersecting>
			<div class="group min-w-40 rounded-md border border-muted p-4">
				<a
					href={pub.link}
					target="_blank"
					rel="noreferrer"
					title={pub.name}
					class="line-clamp-2 group-hover:underline"
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
		</IntersectionWrapper>
	{/each}
</div>

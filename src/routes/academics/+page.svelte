<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { PUBLICATIONS } from '$lib/portfolio_data/academic';
	import { join_to_string_if_array } from '$lib/utils/textUtils';
</script>

<div class="flex flex-wrap gap-4 justify-items-stretch">
	{#each PUBLICATIONS as pub}
		<div class="group min-w-40 max-w-96 rounded-md border border-muted p-4">
			<a
				href={pub.link}
				target="_blank"
				rel="noreferrer"
				title={pub.name}
				class=" h4 line-clamp-3 group-hover:underline"
			>
				{pub.name}
			</a>
			<div class="space-x-2">
				{#each pub.type as t}
					<Badge variant="outline">{t}</Badge>
				{/each}
			</div>
			{#if pub.doi}
				<a href={pub.doi} target="_blank" rel="noreferrer">DOI</a>
			{/if}
			<p class="muted">
				{join_to_string_if_array(pub.published_place)} - {pub.year}
			</p>
		</div>
	{/each}
</div>

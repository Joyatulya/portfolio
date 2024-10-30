<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import type { Publication } from '$lib/portfolio_data/academic';
	import { join_to_string_if_array } from '$lib/utils/textUtils';

	let { pub }: { pub: Publication } = $props();
</script>

<div
	class="group min-w-40 max-w-96 space-y-2 rounded-md border border-muted
				p-4"
>
	<div class="space-x-2">
		{#each pub.type as t}
			<Badge variant="outline">{t}</Badge>
		{/each}
	</div>
	<a
		href={pub.link}
		target="_blank"
		rel="noreferrer"
		title={pub.name}
		class=" h4 line-clamp-3 group-hover:underline"
	>
		{pub.name}
	</a>
	<p class="muted">
		{join_to_string_if_array(pub.published_place)} • {pub.year}
		{#if pub.doi}
			•
			<a href={pub.doi} class="underline" target="_blank" rel="noreferrer">DOI</a>
		{/if}
	</p>
</div>

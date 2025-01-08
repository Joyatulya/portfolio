<script lang="ts">
	import { GITHUB_REPOS } from '$lib/portfolio_data/programming';
</script>

<div>
	{#each GITHUB_REPOS as repo}
		<a href={repo.url} target="_blank" rel="noreferrer" class="block">
			{repo.name}
		</a>
	{/each}
</div>

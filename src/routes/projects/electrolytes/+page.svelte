<script lang="ts">
	import DecisionTree from './components/DecisionTree.svelte';
	import { rootNodes } from './nodes';

	const links = [
		{
			label: 'Hyperkalemia',
			link: '/hyperkalemia'
		}
	];
</script>

<!-- {#each links as link} -->
<!-- 	<a href={'projects/electrolytes/' + link.link}>{link.label}</a> -->
<!-- {/each} -->
<main class="p-4">
	{#each rootNodes as rootNode}
		<DecisionTree {rootNode} />
	{/each}
</main>

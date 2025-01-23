<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { fade } from 'svelte/transition';
	import type { DecisionNode } from '../nodes';
	import { actionHypokalemia, moderateHypokalemia } from '../nodes/potassium';

	let { rootNode }: { rootNode: DecisionNode } = $props();

	let exampleNodes = [rootNode, actionHypokalemia, moderateHypokalemia];
	let nodesTraversed = $state<DecisionNode[]>(exampleNodes);
	let currentNode: DecisionNode = $state(nodesTraversed[nodesTraversed.length - 1]);
	let actions_taken = $state([]);

	let selectedBranch: string | null = $state(null);

	function handleSelection(branch: string) {
		if (currentNode.branches && currentNode.branches[branch]) {
			currentNode = currentNode.branches[branch];
			nodesTraversed.push(currentNode);
			selectedBranch = null;
		}
	}

	function resetTree() {
		currentNode = rootNode;
		nodesTraversed = [currentNode];
		selectedBranch = null;
	}

	function isSelectedBranch() {}
</script>

{#each nodesTraversed as node}
	<div in:fade class="space-y-3 py-4 text-center">
		{@render display_string_or_list(node.action)}
		{@render display_string_or_list(node.info)}
		<div class="space-y-3">
			<p class="text-xl">{node.question}</p>
			{#if node.branches}
				<div class="flex justify-center gap-2">
					{#each Object.keys(node.branches) as branch}
						<Button size="lg" onclick={() => handleSelection(branch)}>{branch}</Button>
					{/each}
				</div>
			{:else}
				<Button onclick={resetTree}>Start Over</Button>
			{/if}
		</div>
	</div>
{/each}

{#if actions_taken}
	My Rx Plan here
{/if}

{#snippet display_string_or_list(data: string | string[])}
	{#if !Array.isArray(data)}
		<p>{data}</p>
	{:else}
		<ul>
			{#each data as item}
				<li>{item}</li>
			{/each}
		</ul>
	{/if}
{/snippet}

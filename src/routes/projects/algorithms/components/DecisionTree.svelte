<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { fade } from 'svelte/transition';
	import { rootNodes, type DecisionNode, type Plan } from '../nodes';
	import { actionHypokalemia, moderateHypokalemia } from '../nodes/potassium';
	import { ArrowDown } from 'lucide-svelte';

	let { rootNode }: { rootNode: DecisionNode } = $props();
	rootNode = rootNode ?? rootNodes[1];
	let plan = $state<Plan>({ Impression: [], Actions: [] });
	let exampleNodes = [rootNodes[1]];
	let nodesTraversed = $state<DecisionNode[]>(randomiseBranches(rootNodes[1]));
	let currentNode: DecisionNode = $state(nodesTraversed[nodesTraversed.length - 1]);
	let selectedBranches = $state<string[]>([]);

	function random_array_element(arr: any[]) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	function randomiseBranches(rootNode: DecisionNode) {
		const traversesd = [rootNode];

		let curr = rootNode;
		let next = null;

		while (curr?.branches) {
			next = curr.branches[random_array_element([...Object.keys(curr.branches)])];
			updatePlan(next);
			traversesd.push(next);
			curr = next;
		}
		return traversesd;
	}

	function updatePlan(node: DecisionNode) {
		if (!node.plan) return;
		for (let [k, v] of Object.entries(node.plan)) {
			plan[k] = [...plan[k], ...v];
		}
	}

	function handleSelection(branch: string) {
		selectedBranches.push(branch);
		if (currentNode.branches && currentNode.branches[branch]) {
			currentNode = currentNode.branches[branch];
			nodesTraversed.push(currentNode);
			updatePlan(currentNode);
		}
	}

	function resetTree() {
		currentNode = rootNode;
		nodesTraversed = [currentNode];
		plan = { Impression: [], Actions: [] };
		selectedBranches = [];
	}

	function isSelectedBranchButton(branch, nodeIdx) {
		if (nodeIdx + 1 > selectedBranches.length) return false;
		return !(selectedBranches[nodeIdx] === branch);
	}
</script>

{#each nodesTraversed as node, nodeIdx}
	<div in:fade class="group mx-auto space-y-3 py-4 text-center">
		{node?.action}
		<p class="text-2xl font-semibold">
			{node?.question}
		</p>
		<p class="text-muted-foreground">
			{node?.info}
		</p>
		<!-- {@render display_string_or_list(node.info)} -->
		<div class="space-y-3">
			<!-- <p class="text-xl">{node.question}</p> -->
			{#if node?.branches}
				<div class="flex flex-wrap justify-center gap-2">
					{#each Object.keys(node.branches) as branch}
						<Button
							disabled={isSelectedBranchButton(branch, nodeIdx)}
							size="lg"
							onclick={() => handleSelection(branch)}>{branch}</Button
						>
					{/each}
				</div>
			{:else}
				<Button onclick={resetTree}>Start Over</Button>
			{/if}
		</div>
		<ArrowDown class="mx-auto my-4 size-8 group-last:hidden" />
	</div>
{/each}

{#if plan}
	<h1 class="text-3xl">Plan</h1>
	<div>
		Impression : {plan.Impression.join(', ')}
	</div>
	<div>
		Actions : {plan.Actions.join(', ')}
	</div>
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

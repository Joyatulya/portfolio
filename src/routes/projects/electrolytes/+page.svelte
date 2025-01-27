<script lang="ts">
	import DecisionTree from './components/DecisionTree.svelte';
	import { rootNodes } from './nodes';
	import { rootHypoNaNode } from './nodes/hyponatremia';

</script>

<main class="p-4">
	<!-- {#each rootNodes as rootNode} -->
	<!-- 	<DecisionTree {rootNode} /> -->
	<!-- {/each} -->
		<DecisionTree {rootHypoNaNode} />
</main>

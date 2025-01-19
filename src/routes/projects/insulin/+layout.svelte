<script lang="ts">
	import { setContext } from 'svelte';

	let { children, data } = $props();
	let { user } = data;
	setContext<typeof user>('user', user);
</script>

{@render children()}

<script lang="ts">
	let { children } = $props();

	// let unit: string | null = localStorage.getItem('unit');
	// if (!unit) {
	// 	unit = 'Imperial';
	// 	localStorage.setItem('unit', unit);
	// }
</script>

{@render children()}

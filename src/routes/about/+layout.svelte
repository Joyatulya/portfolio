<script>
	import Footer from './Footer.svelte';
	let {children} = $props()
</script>

{@render children?.()}
<Footer />

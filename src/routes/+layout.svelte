<script>
	import '../app.css';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	let {children} = $props()
</script>

<Header />
{@render children?.()}
<Footer />

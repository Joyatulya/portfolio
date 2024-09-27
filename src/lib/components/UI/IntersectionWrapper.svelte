<script lang="ts">

	let { intersecting = $bindable(false), threshold = 1, rootMargin = 0 , children} = $props();
	let wrapper: HTMLElement;
	let observer: IntersectionObserver;

	$effect(() => {
		observer = new IntersectionObserver(intersectionCallback, {
			rootMargin: rootMargin + 'px',
			threshold: threshold
		});
		observer.observe(wrapper);
		return () => {
			observer.disconnect();
		};
	});

	function intersectionCallback(entries: IntersectionObserverEntry[]) {
		let entry = entries[0];
		intersecting = entry.isIntersecting;
	}
	$inspect(intersecting)
</script>

<div bind:this={wrapper}>
	{@render children()}
</div>

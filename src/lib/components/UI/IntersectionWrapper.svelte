<script lang="ts">
	import { fade } from "svelte/transition";

	let {  threshold = 1, rootMargin = 0, children } = $props();
	let wrapper: HTMLElement | undefined= $state(undefined);
	let observer: IntersectionObserver;
	let intersecting = $state( false );

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
	$inspect(intersecting);
</script>

	<div class="fade-in-section" class:is-visible={intersecting} bind:this={wrapper}>
		{@render children()}
	</div>

<style>
.fade-in-section {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.6s ease-out, transform 1.2s ease-out;
  will-change: opacity, visibility;
}
.fade-in-section.is-visible {
  opacity: 1;
  transform: none;
  visibility: visible;
}
</style>

<script lang="ts">
	import { SOCIALS } from '$lib/portfolio_data';
	import ContactMe from './ContactMe.svelte';
</script>

<footer class="p-4">
	<ContactMe />

	{#each SOCIALS as social}
		<a href={social.link} target="_blank" rel="noreferrer" class='block'>
			{social.name}
			<svelte:component this={social.logo} />
		</a>
	{/each}
</footer>

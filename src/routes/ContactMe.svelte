<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import IntersectionWrapper from '$lib/components/UI/IntersectionWrapper.svelte';
	import { fade } from 'svelte/transition';

	const contact_links: { title: string; subject: string }[] = [
		{
			title: 'Startups',
			subject: 'Interested in startup'
		},
		{
			title: 'Coffee',
			subject: 'I would like to talk with you'
		},
		{
			title: 'Medicine',
			subject: 'Talk about medicine'
		}
	];
</script>

<section class="flex flex-col md:flex-row">
	<p class="">LET'S <br /> CONNECT</p>
	<div class="">
		<p class="">I am always interested about</p>
		{#each contact_links as link}
			<Button variant="outline" class="" href={'mailto:joy.atulya@gmail.com?subject=' + link.subject}
				>{link.title}</Button
			>
		{/each}
	</div>
</section>

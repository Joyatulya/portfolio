<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PUBLICATIONS } from '$lib/portfolio_data/academic';
	import { ArrowRight } from 'lucide-svelte';
	import GithubRepoComponent from './GithubRepoComponent.svelte';
	import Skills from './Skills.svelte';
	import AcademicCard from './academics/AcademicCard.svelte';
	import { slide } from 'svelte/transition';
	const jobs = ['Joy', 'Doctor', 'Software Engineer', 'Data Scientist'];
	let job_id = $state(0);
	$effect(() => {
		let interval = setInterval(() => {
			job_id = (job_id + 1) % jobs.length;
		}, 2500);
		return () => clearInterval(interval);
	});
</script>

<main class="space-y-8 p-4">
	<section class="h-screen lg:max-h-[800px]">
		<h1 class="my-4 text-3xl">
			Hello I am
			{#if job_id !== 0}
				<span in:slide>a</span>
			{/if}
			{#key job_id}
				<span in:slide out:slide class="block text-4xl">{jobs[job_id]}</span>
			{/key}
		</h1>
		<p class=" font-serif">
			On a quest to understand both <span
				class="gradient font-mono
				uppercase">carbon</span
			>
			&
			<span
				class="gradient font-mono
				uppercase">silicon</span
			> based life.
		</p>
		<div class="p-8">
			<img src="/assets/portrait.png" alt="Me, Joy Singhal" />
		</div>
	</section>
	<Skills />
	<div class="space-y-6">
		<h2 class="h2 text-center">Academic Projects</h2>
		<div class="space-y-4">
			{#each PUBLICATIONS.slice(0, 3) as pub}
				<AcademicCard {pub} />
			{/each}
		</div>
		<Button href="/academics" class="w-full">See all Projects <ArrowRight /></Button>
	</div>
	<GithubRepoComponent />
</main>

<style>
	.gradient {
		background: -webkit-linear-gradient(#eee, #333);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>

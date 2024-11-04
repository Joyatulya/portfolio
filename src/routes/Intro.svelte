<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const skills_links = [
		{
			name: 'Medicine',
			link: '#medicine'
		},
		{
			name: 'Programming',
			link: '#programming'
		},
		{
			name: 'Artificial Intelligence',
			link: '#ai'
		},
		{
			name: 'Research / Statistics',
			link: '#stats'
		}
	];
</script>

<section>
	<div>
		I'm Joy Singhal, a doctor with a passion for merging medicine with engineering, programming, and
		artificial intelligence. My unique skill set bridges the gap between healthcare and technology,
		allowing me to create innovative solutions that improve patient care and advance medical
		research. With expertise in coding, statistics, and machine learning, I work at the intersection
		of data science and medicine, using technology to unlock new insights and enhance clinical
		outcomes.
	</div>
	{#each skills_links as skill}
		<div class="">
			<Button class="block" variant="outline" href={skill.link}>{skill.name}</Button>
		</div>
	{/each}
</section>
